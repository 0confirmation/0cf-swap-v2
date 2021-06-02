import type { ZeroStore } from './ZeroStore';
import BigNumber from 'bignumber.js';
import { NETWORK_LIST } from '../config/constants/network';
import { action, extendObservable } from 'mobx';
import { FeeDescription, RenFees } from '../config/models/currency';
import { SUPPORTED_TOKEN_NAMES } from '../config/constants/tokens';

export default class FeeStore {
	private readonly store!: ZeroStore;
	private gasInterval: NodeJS.Timeout | undefined;
	public gasFee: FeeDescription;
	public mintFee: FeeDescription;
	public btcFee: FeeDescription;
	public zeroFee: FeeDescription;

	constructor(store: ZeroStore) {
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
	private async _gasnowPrices(): Promise<FeeDescription> {
		const prices = await fetch('https://www.gasnow.org/api/v3/gas/price?utm_source=badgerv2');
		const gasEstimate = new BigNumber(1.46e6);
		const result = await prices.json();
		const rapid = new BigNumber(result.data['rapid']);
		const ethGasFee = new BigNumber(gasEstimate).multipliedBy(rapid).dividedBy(1e18);
		const btcGasFee = this.store.currency.toToken(
			ethGasFee,
			SUPPORTED_TOKEN_NAMES.WBTC,
			SUPPORTED_TOKEN_NAMES.ETH,
			undefined,
			true,
		);
		// keepers use 'Rapid' gas prices to handle transactions, so we only are interested in this.
		return {
			scalar: rapid.multipliedBy(1e9),
			value: new BigNumber(btcGasFee),
		};
	}

	/* Pull mint fee from renJS
	 */
	private async _getRenMintFee(): Promise<RenFees> {
		const renJS = this.store.wallet.network.renJS;
		const fees = await renJS.getFees();
		return {
			mintFee: new BigNumber(fees.btc.ethereum.mint).dividedBy(1e4),
			networkFee: new BigNumber(fees.btc.lock).dividedBy(1e8),
		};
	}

	setGasFee = action((value: FeeDescription) => {
		this.gasFee = value;
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
		switch (this.store.wallet.network.name) {
			case NETWORK_LIST.ETH:
				this._gasnowPrices().then((value: FeeDescription) => {
					this.setGasFee(value);
				});
				this._getRenMintFee().then((value: RenFees) => {
					this.setRenFee(value.mintFee, value.networkFee);
				});
				// Update gas price per block
				this.gasInterval = setInterval(() => {
					this._gasnowPrices().then((value: FeeDescription) => {
						this.setGasFee(value);
					});
				}, 1000 * 13);
		}
	});

	getAllFees = (store: ZeroStore, amount: BigNumber, currency: SUPPORTED_TOKEN_NAMES): BigNumber | undefined => {
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
		this.cancelGasInterval();
	});

	cancelGasInterval = () => {
		if (this.gasInterval) clearInterval(this.gasInterval);
	};
}
