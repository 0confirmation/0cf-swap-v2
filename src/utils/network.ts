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

export const getNetworkId = (network: string): number | undefined => {
	switch (network) {
		case NETWORK_LIST.BSC:
			return 56;
		case NETWORK_LIST.ETH:
			return 1;
		default:
			return undefined;
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
