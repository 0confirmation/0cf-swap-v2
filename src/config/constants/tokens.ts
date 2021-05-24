import usdcIcon from '@iconify/icons-cryptocurrency/usdc';
import daiIcon from '@iconify/icons-cryptocurrency/dai';
import ethIcon from '@iconify/icons-cryptocurrency/eth';
import type { IconifyIcon } from '@iconify/react';

export interface TokenDefinition {
	name: string;
	symbol: string;
	address: string;
	decimals: number;
	icon: IconifyIcon;
}

const ethTokens: TokenDefinition[] = [
	{
		name: 'USD-Coin',
		symbol: 'USDC',
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		decimals: 6,
		// Workaround due to some strange iconify typing
		icon: (usdcIcon as unknown) as IconifyIcon,
	},
	{
		name: 'DAI',
		symbol: 'DAI',
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		decimals: 18,
		icon: (daiIcon as unknown) as IconifyIcon,
	},
	{
		name: 'Ethereum',
		symbol: 'ETH',
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		decimals: 18,
		icon: (ethIcon as unknown) as IconifyIcon,
	},
];

// INPUT: optional network, defaults to Ethereum
// OUTPUT: list of token definitions, should be converted to
export const getTokens = (network?: string): TokenDefinition[] => {
	switch (network) {
		default:
			return ethTokens;
	}
};
