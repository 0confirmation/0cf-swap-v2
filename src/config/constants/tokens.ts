import usdcIcon from '@iconify/icons-cryptocurrency/usdc';
import daiIcon from '@iconify/icons-cryptocurrency/dai';
import ethIcon from '@iconify/icons-cryptocurrency/eth';
import btcIcon from '@iconify/icons-cryptocurrency/btc';
import type { IconifyIcon } from '@iconify/react';

export interface TokenDefinition {
	name: SUPPORTED_TOKEN_NAMES;
	symbol: string;
	address: string;
	decimals: number;
	icon: IconifyIcon;
}

export enum SUPPORTED_TOKEN_NAMES {
	USDC = 'USDC',
	DAI = 'DAI',
	ETH = 'Ethereum',
	WBTC = 'wBTC',
}

export const ETH_TOKENS: TokenDefinition[] = [
	{
		name: SUPPORTED_TOKEN_NAMES.USDC,
		symbol: 'USDC',
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		decimals: 6,
		// Workaround due to some strange iconify typing
		icon: usdcIcon as unknown as IconifyIcon,
	},
	{
		name: SUPPORTED_TOKEN_NAMES.DAI,
		symbol: 'DAI',
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		decimals: 18,
		icon: daiIcon as unknown as IconifyIcon,
	},
	{
		name: SUPPORTED_TOKEN_NAMES.ETH,
		symbol: 'ETH',
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		decimals: 18,
		icon: ethIcon as unknown as IconifyIcon,
	},
	{
		name: SUPPORTED_TOKEN_NAMES.WBTC,
		symbol: 'wBTC',
		address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
		decimals: 8,
		icon: btcIcon as unknown as IconifyIcon,
	},
];

export const BSC_TOKENS: TokenDefinition[] = [
	{
		name: SUPPORTED_TOKEN_NAMES.USDC,
		symbol: 'USDC',
		address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
		decimals: 18,
		icon: usdcIcon as unknown as IconifyIcon,
	},
	{
		name: SUPPORTED_TOKEN_NAMES.DAI,
		symbol: 'DAI',
		address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
		decimals: 18,
		icon: daiIcon as unknown as IconifyIcon,
	},
];
