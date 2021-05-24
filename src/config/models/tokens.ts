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

	// Update the price to the provided amount
	setPrice = action((price: BigNumber) => {
		this.price = price;
	});

	// Amount of tokens received given an amount of bitcoin and optional
	// gas costs and fees.
	valueOut(amount: BigNumber, gasCost?: BigNumber, fees?: BigNumber): string | null {
		if (!this.store.currency.prices || this.price.eq(0)) return null;
		const feeAmount = fees || new BigNumber(0);
		const gasAmount = gasCost || new BigNumber(0);

		const ethPrice: BigNumber = this.store.currency.prices['ethereum']['btc'];
		const gasInSats: BigNumber = gasAmount.multipliedBy(ethPrice);

		return amount.minus(feeAmount).minus(gasInSats).dividedBy(this.price).toString();
	}
}
