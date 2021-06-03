import type BigNumber from 'bignumber.js';

export type PriceSummary = {
	[id: string]: BigNumber;
};
export type FeeDescription = {
	value: BigNumber | undefined;
	scalar: BigNumber | undefined;
};
export type RenFees = {
	mintFee: BigNumber;
	networkFee: BigNumber;
};

export interface PriceHistory {
	currentPrice: BigNumber;
	oldPrice: BigNumber;
}
