import type { NetworkConstants } from '../models/network';

export const APP_NAME = '0cf';
export const CONTACT_EMAIL = 'andrew@0confirmation.com';
export const PORTIS_APP_ID = '72ef7613-7d8d-407e-88eb-b6afb998c990';

export enum NETWORK_LIST {
	BSC = 'bsc',
	ETH = 'eth',
}

export enum NETWORK_IDS {
	ETH = 1,
	BSC = 56,
	MATIC = 137,
	FTM = 250,
	XDAI = 100,
}

export const NETWORK_CONSTANTS: NetworkConstants = {
	[NETWORK_LIST.ETH]: {
		APP_URL: 'https://mainnet.0confirmation.com/',
		RPC_URL: 'https://mainnet.infura.io/v3/2f1de898efb74331bf933d3ac469b98d',
		REN_GATEWAY_ADDRESS: '0xe4b679400F0f267212D5D812B95f58C83243EE71',
	},
};
