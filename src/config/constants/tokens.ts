import type { IconifyIcon } from '@iconify/react';
import { NETWORK_LIST } from './network';
export interface TokenDefinition {
	name: SUPPORTED_TOKEN_NAMES;
	symbol: string;
	address: string;
	decimals: number;
	icon: IconifyIcon;
	inRoute: string[];
	outRoute: string[];
}

export type BaseCurrency = {
	[network in NETWORK_LIST]: TokenDefinition;
};

export enum SUPPORTED_TOKEN_NAMES {
	USDC = 'USDC',
	DAI = 'DAI',
	ETH = 'Ethereum',
	WBTC = 'wBTC',
	MATIC = 'Matic',
	BNB = 'BNB',
}
