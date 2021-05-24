import { NETWORK_IDS, NETWORK_LIST } from '../config/constants/network';
import { BscNetwork, EthNetwork, Network } from '../config/models/network';

export const getNetwork = (network?: string): Network => {
	switch (network) {
		case NETWORK_LIST.BSC:
			return new BscNetwork();
		default:
			return new EthNetwork();
	}
};

export const getNetworkId = (network?: string): number => {
	switch (network) {
		case NETWORK_LIST.BSC:
			return 56;
		// case NETWORK_LIST.XDAI:
		// 	return 100;
		// case NETWORK_LIST.FTM:
		// 	return 250;
		// case NETWORK_LIST.MATIC:
		// 	return 137;
		default:
			return 1;
	}
};

export const getNetworkNameFromId = (network: number): string | undefined => {
	switch (network) {
		case NETWORK_IDS.BSC:
			return NETWORK_LIST.BSC;
		case NETWORK_IDS.ETH:
			return NETWORK_LIST.ETH;
		default:
			return undefined;
	}
};
