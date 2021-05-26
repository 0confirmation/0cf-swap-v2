import { NETWORK_LIST, NETWORK_IDS } from '../constants/network';
import { getTokens, TokenDefinition } from '../constants/tokens';
const RenJS = require('@0confirmation/sdk/renvm');

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
}

export class EthNetwork implements Network {
	readonly name = NETWORK_LIST.ETH;
	readonly networkId = NETWORK_IDS.ETH;
	readonly fullName = 'Ethereum';
	public tokens = getTokens(NETWORK_LIST.ETH);
	public renJS = new RenJS('mainnet');
}

export class BscNetwork implements Network {
	readonly name = NETWORK_LIST.BSC;
	readonly networkId = NETWORK_IDS.BSC;
	readonly fullName = 'Binance Smart Chain';
	public tokens = getTokens(NETWORK_LIST.ETH);
}
