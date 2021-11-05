import type { Store } from './Store';
import BigNumber from 'bignumber.js';
import { action, extendObservable } from 'mobx';
import { FeeDescription, RenFees } from '../config/models/currency';
import { SUPPORTED_TOKEN_NAMES } from '../config/constants/tokens';
import { cancelInterval } from '../utils/helpers';
import { Bitcoin } from '@renproject/chains-bitcoin';
const ethers = require('ethers');
const utils = require('ethers').utils;

const { createGetGasPrice } = require('ethers-polygongastracker');

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
		const baseCurrency = this.store.wallet.network.baseCurrency;
		let gasGwei = new BigNumber(5);
		const gasEstimate = new BigNumber(6e5);

		/*
		 * Override ethers provider getGasPrice function
		 * when using the Polygon
		 */
		const provider = this.store.wallet.provider;
		if (provider) {
			provider.getGasPrice = createGetGasPrice('rapid');
			const polygonPrice = await provider.getGasPrice();
			gasGwei = new BigNumber(polygonPrice.toNumber());
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
		this.getGasPrices().then((value: FeeDescription | null) => {
			this.setGasFee(value);
		});
		this._getRenMintFee().then((value: RenFees) => {
			this.setRenFee(value.mintFee, value.networkFee);
		});
		this.gasInterval = setInterval(() => {
			this.getGasPrices().then((value: FeeDescription | null) => {
				this.setGasFee(value);
			});
		}, 1000 * 13);
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
