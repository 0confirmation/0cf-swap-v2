import type { Store } from './Store';
import BigNumber from 'bignumber.js';
import { NETWORK_LIST } from '../config/constants/network';
import { action, extendObservable } from 'mobx';
import { FeeDescription, RenFees } from '../config/models/currency';
import { SUPPORTED_TOKEN_NAMES } from '../config/constants/tokens';
import { cancelInterval } from '../utils/helpers';
import { Bitcoin } from '@renproject/chains-bitcoin';

export default class FeeStore {
	private readonly store!: Store;
	private gasInterval: NodeJS.Timeout | undefined;
	public gasFee: FeeDescription;
	public mintFee: FeeDescription;
	public btcFee: FeeDescription;
	public zeroFee: FeeDescription;

	constructor(store: Store) {
		this.store = store;
		this.gasFee = { value: undefined, scalar: undefined };
		this.mintFee = { value: undefined, scalar: undefined };
		this.btcFee = { value: undefined, scalar: undefined };
		this.zeroFee = { value: undefined, scalar: new BigNumber(0.001) };
		extendObservable(this, {
			gasFee: { value: undefined, scalar: undefined },
			mintFee: { value: undefined, scalar: undefined },
			btcFee: { value: undefined, scalar: undefined },
			zeroFee: { value: undefined, scalar: new BigNumber(0.001) },
		});
	}

	/* ETH gas prices based on https://gasnow.org/
	 */
	private async getGasPrices(): Promise<FeeDescription | null> {
		const gasEndpoint = this.store.wallet.network.gasEndpoint;
		const gasSpeed = this.store.wallet.network.gasSpeed;
		const gasMultiplier = this.store.wallet.network.gasMultiplier;

		const baseCurrency = this.store.wallet.network.baseCurrency;
		const prices = gasEndpoint ? await fetch(gasEndpoint) : null;

		let gasGwei = new BigNumber(5);
		const gasEstimate = new BigNumber(1.46e6);

		if (prices && gasSpeed) {
			const result = await prices.json();
			const data = result.data ?? result;
			gasGwei = new BigNumber(data[gasSpeed]).multipliedBy(gasMultiplier);
		}
		const ethGasFee = new BigNumber(gasEstimate).multipliedBy(gasGwei).dividedBy(1e18);
		const btcGasFee = this.store.currency.toToken(
			ethGasFee,
			SUPPORTED_TOKEN_NAMES.WBTC,
			baseCurrency.name,
			undefined,
			true,
		);
		return {
			scalar: new BigNumber(gasGwei).multipliedBy(1e9),
			value: new BigNumber(btcGasFee),
		};
	}

	/* Pull mint fee from renJS
	 */
	private async _getRenMintFee(): Promise<RenFees> {
		if (this.store.wallet.provider) {
			const renJS = this.store.wallet.renJS;
			const renNetwork = this.store.wallet.network.renNetwork;
			const onboardProvider = this.store.wallet.onboard.getState().wallet.provider;

			const fees = await renJS.getFees({
				asset: 'BTC',
				from: Bitcoin(),
				to: renNetwork(onboardProvider, 'mainnet'),
			});
			return {
				mintFee: new BigNumber(fees.mint).dividedBy(1e4),
				networkFee: new BigNumber(fees.lock ?? 0).dividedBy(1e8),
			};
		} else {
			return {
				mintFee: new BigNumber(0),
				networkFee: new BigNumber(0),
			};
		}
	}

	setGasFee = action((value: FeeDescription | null) => {
		this.gasFee = value ?? { value: undefined, scalar: undefined };
	});

	setRenFee = action((mintFee: BigNumber, networkFee: BigNumber): void => {
		this.mintFee.scalar = mintFee;
		this.btcFee.value = networkFee;
	});

	/* Pulls data for the current network and sets the gas fee to
	 * the appropriate amount, stored in wei.  We poll this every 8
	 * seconds per gasNow's standard updates.
	 */
	setFees = action(() => {
		this.clearFees();

		switch (this.store.wallet.network.name) {
			case NETWORK_LIST.ETH:
				this.getGasPrices().then((value: FeeDescription | null) => {
					this.setGasFee(value);
				});
				this._getRenMintFee().then((value: RenFees) => {
					this.setRenFee(value.mintFee, value.networkFee);
				});
				// Update gas price per block
				this.gasInterval = setInterval(() => {
					this.getGasPrices().then((value: FeeDescription | null) => {
						this.setGasFee(value);
					});
				}, 1000 * 13);
				break;
			case NETWORK_LIST.MATIC:
				this._getRenMintFee().then((value: RenFees) => {
					this.setRenFee(value.mintFee, value.networkFee);
				});
				this.getGasPrices().then((value: FeeDescription | null) => {
					this.setGasFee(value);
				});
				this.gasInterval = setInterval(() => {
					this.getGasPrices().then((value: FeeDescription | null) => {
						this.setGasFee(value);
					});
				}, 1000 * 13);
		}
	});

	getAllFees = (store: Store, amount: BigNumber, currency: SUPPORTED_TOKEN_NAMES): BigNumber | undefined => {
		const currencyPrice = store.currency.prices ? store.currency.prices[currency] : null;
		if (!currencyPrice) return undefined;

		const calcBtcFee = this.btcFee.value ? this.btcFee.value.multipliedBy(currencyPrice) : new BigNumber(0);
		const zeroFee = this.zeroFee.scalar
			? new BigNumber(amount.multipliedBy(this.zeroFee.scalar))
			: new BigNumber(0);
		const gasFee = this.gasFee.value?.multipliedBy(currencyPrice) ?? new BigNumber(0);
		const mintFee = this.mintFee.scalar
			? new BigNumber(amount.multipliedBy(this.mintFee.scalar))
			: new BigNumber(0);
		return calcBtcFee.plus(zeroFee).plus(gasFee).plus(mintFee);
	};

	/* Clear all fees and intervals.
	 */
	clearFees = action(() => {
		this.gasFee = {
			value: undefined,
			scalar: undefined,
		};
		this.mintFee = {
			value: undefined,
			scalar: undefined,
		};
		cancelInterval(this.gasInterval);
	});
}
