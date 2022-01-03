import { NETWORK_LIST, NETWORK_IDS } from '../constants/network';
import { SUPPORTED_TOKEN_NAMES, TokenDefinition } from '../constants/tokens';
import {
	Ethereum,
	EthereumClass,
	Polygon,
	PolygonClass,
	BinanceSmartChain,
	BinanceSmartChainClass,
} from '@renproject/chains-ethereum';
import { CallableConstructor } from '@renproject/utils';
import EthSushiRouter from '../abis/eth/SushiRouter.json';
import type { IconifyIcon } from '@iconify/react';
import usdcIcon from '@iconify/icons-cryptocurrency/usdc';
import daiIcon from '@iconify/icons-cryptocurrency/dai';
import ethIcon from '@iconify/icons-cryptocurrency/eth';
import btcIcon from '@iconify/icons-cryptocurrency/btc';
import maticIcon from '@iconify/icons-cryptocurrency/matic';
import bnbIcon from '@iconify/icons-cryptocurrency/bnb';

export type NetworkConstants = {
	[index: string]: {
		[key: string]: string;
	};
};

export type NotifyOptions = {
	dappId: string;
	networkId: number;
};

export interface Network {
	name: NETWORK_LIST;
	networkId: number;
	fullName: string;
	tokens: TokenDefinition[];
	gasEndpoint?: string;
	gasSpeed?: string;
	baseCurrency: TokenDefinition;
	gasMultiplier: number;
	renNetwork:
		| CallableConstructor<typeof EthereumClass>
		| CallableConstructor<typeof PolygonClass>
		| CallableConstructor<typeof BinanceSmartChainClass>;
	tokenList: TokenAddressMap;
	sushiRouter: string;
	sushiRouterAbi: any;
	tokenMap: { [name: string]: TokenDefinition };
}

export interface TokenAddressMap {
	[name: string]: string;
}

export class EthNetwork implements Network {
	readonly name = NETWORK_LIST.ETH;
	readonly networkId = NETWORK_IDS.ETH;
	readonly fullName = 'Ethereum';
	public tokenList = {
		[SUPPORTED_TOKEN_NAMES.ETH]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		[SUPPORTED_TOKEN_NAMES.DAI]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		[SUPPORTED_TOKEN_NAMES.USDC]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		[SUPPORTED_TOKEN_NAMES.WBTC]: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
	};
	public tokens = [
		{
			name: SUPPORTED_TOKEN_NAMES.ETH,
			symbol: 'ETH',
			address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			decimals: 18,
			icon: ethIcon as unknown as IconifyIcon,
			inRoute: [this.tokenList.wBTC, this.tokenList.Ethereum],
			outRoute: [this.tokenList.Ethereum, this.tokenList.wBTC],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.USDC,
			symbol: 'USDC',
			address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			decimals: 6,
			// Workaround due to some strange iconify typing
			icon: usdcIcon as unknown as IconifyIcon,
			inRoute: [this.tokenList.wBTC, this.tokenList.Ethereum, this.tokenList.USDC],
			outRoute: [this.tokenList.USDC, this.tokenList.Ethereum, this.tokenList.wBTC],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.DAI,
			symbol: 'DAI',
			address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
			decimals: 18,
			icon: daiIcon as unknown as IconifyIcon,
			inRoute: [this.tokenList.wBTC, this.tokenList.Ethereum, this.tokenList.DAI],
			outRoute: [this.tokenList.DAI, this.tokenList.Ethereum, this.tokenList.wBTC],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.WBTC,
			symbol: 'wBTC',
			address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
			decimals: 8,
			icon: btcIcon as unknown as IconifyIcon,
			inRoute: [],
			outRoute: [],
		},
	];
	public gasEndpoint =
		'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=7R9E7MZMMK8KQS4HWINGGFT613DMYQ1VU6';
	public gasSpeed = 'suggestBaseFee';
	public gasMultiplier = 1e9;
	public baseCurrency = this.tokens[0];
	public renNetwork = Ethereum;
	public tokenMap = this.tokens.reduce(function (result, token, index, array) {
		result[token.name] = token;
		return result;
	}, {});
	public sushiRouter = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F';
	public sushiRouterAbi = EthSushiRouter;
}

export class BscNetwork implements Network {
	readonly name = NETWORK_LIST.BSC;
	readonly networkId = NETWORK_IDS.BSC;
	readonly fullName = 'Binance Smart Chain';
	public tokens = [
		{
			name: SUPPORTED_TOKEN_NAMES.BNB,
			symbol: 'BNB',
			address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
			decimals: 18,
			icon: bnbIcon as unknown as IconifyIcon,
			inRoute: [],
			outRoute: [],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.USDC,
			symbol: 'USDC',
			address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
			decimals: 18,
			icon: usdcIcon as unknown as IconifyIcon,
			inRoute: [],
			outRoute: [],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.DAI,
			symbol: 'DAI',
			address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
			decimals: 18,
			icon: daiIcon as unknown as IconifyIcon,
			inRoute: [],
			outRoute: [],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.WBTC,
			symbol: 'BTCB',
			address: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
			decimals: 18,
			icon: btcIcon as unknown as IconifyIcon,
			inRoute: [],
			outRoute: [],
		},
	];
	public baseCurrency = this.tokens[0];
	public gasMultiplier = 1e9;
	public renNetwork = BinanceSmartChain;
	public tokenList = {
		[SUPPORTED_TOKEN_NAMES.DAI]: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
		[SUPPORTED_TOKEN_NAMES.USDC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
		[SUPPORTED_TOKEN_NAMES.WBTC]: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
		[SUPPORTED_TOKEN_NAMES.BNB]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
	};
	public tokenMap = this.tokens.reduce(function (result, token, index, array) {
		result[token.name] = token;
		return result;
	}, {});
	public sushiRouter = '';
	public sushiRouterAbi = '';
}

export class MaticNetwork implements Network {
	readonly name = NETWORK_LIST.MATIC;
	readonly networkId = NETWORK_IDS.MATIC;
	readonly fullName = 'Polygon';
	public tokenList = {
		[SUPPORTED_TOKEN_NAMES.ETH]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
		[SUPPORTED_TOKEN_NAMES.DAI]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
		[SUPPORTED_TOKEN_NAMES.USDC]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
		[SUPPORTED_TOKEN_NAMES.WBTC]: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
		[SUPPORTED_TOKEN_NAMES.MATIC]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
	};
	public tokens = [
		{
			name: SUPPORTED_TOKEN_NAMES.MATIC,
			symbol: 'MATIC',
			address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
			decimals: 18,
			icon: maticIcon as unknown as IconifyIcon,
			inRoute: [this.tokenList.wBTC, this.tokenList.Ethereum, this.tokenList.Matic],
			outRoute: [this.tokenList.Matic, this.tokenList.Ethereum, this.tokenList.wBTC],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.USDC,
			symbol: 'USDC',
			address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
			decimals: 6,
			icon: usdcIcon as unknown as IconifyIcon,
			inRoute: [this.tokenList.wBTC, this.tokenList.Ethereum, this.tokenList.USDC],
			outRoute: [this.tokenList.USDC, this.tokenList.Ethereum, this.tokenList.wBTC],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.DAI,
			symbol: 'DAI',
			address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
			decimals: 18,
			icon: daiIcon as unknown as IconifyIcon,
			inRoute: [this.tokenList.wBTC, this.tokenList.Ethereum, this.tokenList.DAI],
			outRoute: [this.tokenList.DAI, this.tokenList.Ethereum, this.tokenList.wBTC],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.WBTC,
			symbol: 'wBTC',
			address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
			decimals: 8,
			icon: btcIcon as unknown as IconifyIcon,
			inRoute: [],
			outRoute: [],
		},
		{
			name: SUPPORTED_TOKEN_NAMES.ETH,
			symbol: 'ETH',
			address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
			decimals: 18,
			icon: ethIcon as unknown as IconifyIcon,
			inRoute: [this.tokenList.wBTC, this.tokenList.Ethereum],
			outRoute: [this.tokenList.Ethereum, this.tokenList.wBTC],
		},
	];
	public tokenMap = this.tokens.reduce(function (result, token, index, array) {
		result[token.name] = token;
		return result;
	}, {});
	public baseCurrency = this.tokens[0];
	public gasEndpoint = 'https://gasstation-mainnet.matic.network';
	public gasSpeed = 'fastest';
	public gasMultiplier = 1e9;
	public renNetwork = Polygon;
	public sushiRouter = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506';
	public sushiRouterAbi = EthSushiRouter;
}
