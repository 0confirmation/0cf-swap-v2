import { NETWORK_LIST, NETWORK_IDS } from '../constants/network';
import { TokenDefinition } from '../constants/tokens';
import { getTokens } from '../../utils/helpers';
import {
	EthereumClass,
	PolygonClass,
	BinanceSmartChainClass,
	Ethereum,
	Polygon,
	BinanceSmartChain,
} from '@renproject/chains';
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
	public renNetwork = Ethereum;
}

export class BscNetwork implements Network {
	readonly name = NETWORK_LIST.BSC;
	readonly networkId = NETWORK_IDS.BSC;
	readonly fullName = 'Binance Smart Chain';
	public tokens = getTokens(NETWORK_LIST.ETH);
	public renNetwork = BinanceSmartChain;
}

export class MaticNetwork implements Network {
	readonly name = NETWORK_LIST.MATIC;
	readonly networkId = NETWORK_IDS.MATIC;
	readonly fullName = 'Polygon';
	public tokens = getTokens(NETWORK_LIST.MATIC);
	public renNetwork = Polygon;
}
