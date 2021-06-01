import type { API, Wallet } from 'bnc-onboard/dist/src/interfaces';
import type { API as NotifyAPI } from 'bnc-notify';
import type { ZeroStore } from './ZeroStore';
import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';
import { notifyOptions, onboardWalletCheck, getOnboardWallets } from '../config/wallets';
import { action, extendObservable } from 'mobx';
import { getNetwork } from '../utils/network';
import type { Network } from '../config/models/network';
import { ethers } from 'ethers';
import type Zero from '@0confirmation/sdk';

export default class WalletStore {
	private store: ZeroStore;
	public onboard: API;
	public connectedAddress: string = '';
	public network: Network;
	public notify: NotifyAPI;
	public currentBlock?: number;
	public zero: typeof Zero | undefined;
	public provider: ethers.providers.Web3Provider | undefined;

	constructor(store: ZeroStore) {
		this.network = getNetwork();
		this.store = store;
		this.notify = Notify(notifyOptions);

		//TODO: Update CSS for onboard modal
		const onboardOptions = {
			dappId: '42e99bd1-7ec3-47c5-8add-c46955f5036b',
			networkId: this.network.networkId,
			subscriptions: {
				address: (address: string) => {
					this.connectedAddress = address;
				},
				wallet: (wallet: Wallet) => {
					if (wallet.name) window.localStorage.setItem('selectedWallet', wallet.name);
				},
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
			zero: undefined,
			gasFee: undefined,
		});
	}

	isCached = action(() => {
		return !!this.connectedAddress || !!window.localStorage.getItem('selectedWallet');
	});

	connect = action((wsOnboard: API) => {
		const walletState = wsOnboard.getState();
		this.connectedAddress = walletState.address;
		this.onboard = wsOnboard;
		this.provider = new ethers.providers.Web3Provider(walletState.wallet.provider);
		this._setZero(this.provider);
		this.store.fees.setFees();
		this.store.currency.loadPrices();
	});

	disconnect = action(() => {
		this.connectedAddress = '';
		this.store.fees.clearFees();
		this.zero = undefined;
		this.onboard.walletReset();
		this.provider = undefined;
	});

	/* Utilizes the user's provider to connect to the
	 * Zero network.
	 */
	private _setZero = action(async (provider: any) => {
		const Zero = require('@0confirmation/sdk');
		this.zero = new Zero(provider, 'mainnet');
		await this.zero.initializeDriver();
	});
}
