import type BigNumber from 'bignumber.js';

export type PriceDetail = {
	[id: string]: BigNumber;
};
export type PriceSummary = {
	[id: string]: PriceDetail;
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
