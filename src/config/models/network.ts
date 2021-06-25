import { NETWORK_LIST, NETWORK_IDS } from '../constants/network';
import { BASE_CURRENCY, TokenDefinition } from '../constants/tokens';
import { getTokens } from '../../utils/helpers';
import {
	Ethereum,
	EthereumClass,
	Polygon,
	PolygonClass,
	BinanceSmartChain,
	BinanceSmartChainClass,
} from '@renproject/chains-ethereum';
import { CallableConstructor } from '@renproject/utils';

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
}

export class EthNetwork implements Network {
	readonly name = NETWORK_LIST.ETH;
	readonly networkId = NETWORK_IDS.ETH;
	readonly fullName = 'Ethereum';
	public tokens = getTokens(NETWORK_LIST.ETH);
	public gasEndpoint = 'https://www.gasnow.org/api/v3/gas/price?utm_source=zerodao';
	public gasSpeed = 'rapid';
	public gasMultiplier = 1;
	public baseCurrency = BASE_CURRENCY[NETWORK_LIST.ETH];
	public renNetwork = Ethereum;
}

export class BscNetwork implements Network {
	readonly name = NETWORK_LIST.BSC;
	readonly networkId = NETWORK_IDS.BSC;
	readonly fullName = 'Binance Smart Chain';
	public tokens = getTokens(NETWORK_LIST.ETH);
	public baseCurrency = BASE_CURRENCY[NETWORK_LIST.BSC];
	public gasMultiplier = 1e9;
	public renNetwork = BinanceSmartChain;
}

export class MaticNetwork implements Network {
	readonly name = NETWORK_LIST.MATIC;
	readonly networkId = NETWORK_IDS.MATIC;
	readonly fullName = 'Polygon';
	public tokens = getTokens(NETWORK_LIST.MATIC);
	public baseCurrency = BASE_CURRENCY[NETWORK_LIST.MATIC];
	public gasEndpoint = 'https://gasstation-mainnet.matic.network';
	public gasSpeed = 'fastest';
	public gasMultiplier = 1e9;
	public renNetwork = Polygon;
}
