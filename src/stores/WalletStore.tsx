import type { API, Wallet } from 'bnc-onboard/dist/src/interfaces';
import type { API as NotifyAPI } from 'bnc-notify';
import type { Store } from './Store';
import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';
import { notifyOptions, onboardWalletCheck, getOnboardWallets } from '../config/wallets';
import { action, extendObservable, runInAction } from 'mobx';
import { getNetwork, getNetworkFromProvider, getNetworkNameFromId } from '../utils/network';
import type { Network } from '../config/models/network';
import { ethers } from 'ethers';
import RenJS from '@renproject/ren';

export default class WalletStore {
	private store: Store;
	public onboard: API;
	public connectedAddress: string = '';
	public network: Network;
	public notify: NotifyAPI;
	public currentBlock?: number;
	public provider: ethers.providers.Web3Provider | undefined;
	public loading: boolean;
	public renJS: RenJS;

	constructor(store: Store) {
		this.network = getNetwork();
		this.store = store;
		this.notify = Notify(notifyOptions);
		this.loading = false;
		this.renJS = new RenJS('mainnet');

		//TODO: Update CSS for onboard modal
		const onboardOptions = {
			dappId: '42e99bd1-7ec3-47c5-8add-c46955f5036b',
			networkId: this.network.networkId,
			subscriptions: {
				address: (address: string) => {
					this.setAddress(address);
				},
				wallet: (wallet: Wallet) => {
					if (wallet.name) window.localStorage.setItem('selectedWallet', wallet.name);
				},
				network: this.checkNetwork,
			},
			walletSelect: {
				heading: 'Connect to Zero Swap',
				description: 'Use BTC on DeFi in as little as 2 minutes',
				wallets: getOnboardWallets(this.network.name),
			},
			walletCheck: onboardWalletCheck,
		};
		this.onboard = Onboard(onboardOptions);

		extendObservable(this, {
			connectedAddress: this.connectedAddress,
			network: this.network,
			onboard: this.onboard,
			currentBlock: undefined,
			gasFee: undefined,
			provider: undefined,
			loading: false,
		});

		this.init();
	}

	init = action(async () => {
		const previouslySelectedWallet = window.localStorage.getItem('selectedWallet');
		if (!!previouslySelectedWallet) {
			const walletSelected = await this.onboard.walletSelect(previouslySelectedWallet);
			let walletReady = false;
			try {
				walletReady = await this.onboard.walletCheck();
			} catch (err) {
				this.onboard.walletReset();
				return;
			}
			if (walletSelected && walletReady) {
				this.connect(this.onboard);
			} else {
				this.walletReset();
			}
		}
	});

	setAddress = action(async (address: string): Promise<void> => {
		if (await this.checkSupportedNetwork()) {
			runInAction(() => {
				this.connectedAddress = address;
			});
			await this.store.storeRefresh();
		} else {
			runInAction(() => {
				this.connectedAddress = '';
			});
		}
	});

	setLoading = action((status: boolean): void => {
		this.loading = status;
	});

	isCached = action(() => {
		return !!this.connectedAddress || !!window.localStorage.getItem('selectedWallet');
	});

	connect = action((wsOnboard: API) => {
		const walletState = wsOnboard.getState();
		const provider = new ethers.providers.Web3Provider(walletState.wallet.provider);
		if (this.checkSupportedNetwork(provider)) {
			this.onboard = wsOnboard;
			this.provider = provider;
			this.setAddress(wsOnboard.getState().address);
			this.store.zero.setZero(provider);
			Promise.all([this.store.storeRefresh()]);
		} else {
			this.walletReset();
		}
	});

	disconnect = action(() => {
		this.setAddress('');
		this.store.fees.clearFees();
		this.store.zero.setZero(undefined);
		this.onboard.walletReset();
		this.provider = undefined;
		if (this.isCached()) window.localStorage.removeItem('selectedWallet');
	});

	walletReset = action((): void => {
		try {
			this.onboard.walletReset();
			this.provider = undefined;
			this.setAddress('');
			window.localStorage.removeItem('selectedWallet');
		} catch (err) {
			console.log(err);
		}
	});

	/* Network should be checked based on the provider.  You can either provide a provider
	 * if the current one is not set or it's a new one, or use the current set provider by
	 * not passing in a value.
	 */
	checkSupportedNetwork = async (provider?: ethers.providers.Web3Provider): Promise<boolean> => {
		const currentNetwork = provider ? await provider.getNetwork() : await this.provider?.getNetwork();
		const chainId = currentNetwork?.chainId ?? null;
		if (chainId) {
			const name = getNetworkNameFromId(chainId);
			return !!name;
		}
		return false;
	};

	checkNetwork = action(async (): Promise<void> => {
		const walletState = this.onboard.getState();
		const walletName = walletState.wallet.name;
		if (!walletName || !walletState.wallet.provider) return;
		const newProvider = new ethers.providers.Web3Provider(walletState.wallet.provider);

		// If this returns undefined, the network is not supported.
		const connectedNetwork = await getNetworkFromProvider(newProvider);

		if (!connectedNetwork) {
			this.onboard.walletReset();
			window.localStorage.removeItem('selectedWallet');
			return;
		}
		const newNetwork = getNetwork(connectedNetwork);
		if (newNetwork.networkId !== this.network.networkId) {
			runInAction(() => {
				this.network = newNetwork;
			});
			this.provider = newProvider;
			this.store.storeRefresh();
		}
		return;
	});
}
