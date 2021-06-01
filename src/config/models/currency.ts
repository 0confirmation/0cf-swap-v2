import type BigNumber from 'bignumber.js';

export type PriceSummary = {
	[id: string]: BigNumber;
};
export type ExchangeRateDetail = {
	name: string;
	unit: string;
	value: number;
	type: string;
};
export type ExchangeRates = {
	rates: { [id: string]: ExchangeRateDetail };
};
export type FeeDescription = {
	value: BigNumber | undefined;
	scalar: BigNumber | undefined;
};
export type RenFees = {
	mintFee: BigNumber;
	networkFee: BigNumber;
};
