import BigNumber from 'bignumber.js';
import { action, extendObservable } from 'mobx';
import type { ZeroStore } from '../../stores/ZeroStore';

export interface TokenMap {
	[name: string]: Token;
}

export class Token {
	private store!: ZeroStore;
	public name: string;
	public symbol: string;
	public address: string;
	public decimals: number;
	public price: BigNumber;

	constructor(store: ZeroStore, address: string, name: string, symbol: string, decimals: number, price?: BigNumber) {
		this.store = store;
		this.name = name;
		this.symbol = symbol;
		this.address = address;
		this.decimals = decimals;
		extendObservable(this, {
			price: undefined,
		});
		// Quick reference price stored in sats
		this.price = price ? price : new BigNumber(0);
	}

	setPrice = action((price: BigNumber) => {
		this.price = price;
	});

	/* Returns the amount of tokens received less gas and fees (optional)
	 * @param amount = BigNumber amount of Bitcoin user is providing
	 * @param gasCost = Estimation of gas cost for the transaction in wei
	 * @param fees = fees in sats
	 */
	valueOut(amount: BigNumber, gasCost?: BigNumber, fees?: BigNumber): string | null {
		if (!this.store.currency.prices || this.price.eq(0)) return null;
		const feeAmount = fees ? fees.dividedBy(1e8) : new BigNumber(0);
		const gasAmount = gasCost ? gasCost.dividedBy(1e18) : new BigNumber(0);

		const ethPrice: BigNumber = this.store.currency.prices['ethereum']['btc'];
		const gasInSats: BigNumber = gasAmount.multipliedBy(ethPrice);

		return amount.minus(feeAmount).minus(gasInSats).dividedBy(this.price).toString();
	}

	/* Returns the amount of Bitcoin needed to receive the amount of wanted tokens
	 * less gas and fees (optional)
	 * @param amount = BigNumber amount of tokens user wants
	 * @param gasCost = Estimation of gas cost for the transaction in wei
	 * @param fees = fees in sats
	 */
	valueIn(amount: BigNumber, gasCost?: BigNumber, fees?: BigNumber): string | null {
		if (!this.store.currency.prices || this.price.eq(0)) return null;
		const feeAmount = fees ? fees.dividedBy(1e8) : new BigNumber(0);
		const gasAmount = gasCost ? gasCost.dividedBy(1e18) : new BigNumber(0);

		const ethPrice: BigNumber = this.store.currency.prices['ethereum']['btc'];
		const gasInSats: BigNumber = gasAmount.multipliedBy(ethPrice);

		return amount.multipliedBy(this.price).minus(feeAmount).minus(gasInSats).toString();
	}
}
