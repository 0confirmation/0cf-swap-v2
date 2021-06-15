import { NETWORK_IDS, NETWORK_LIST } from '../config/constants/network';
import { BscNetwork, EthNetwork, Network } from '../config/models/network';

/* Return a network class based on the provided network name
 * @param newtork = NETWORK_LIST enum of the class you'd like to receive
 * @return instanciated class of the network, default ETH
 */
export const getNetwork = (network?: NETWORK_LIST): Network => {
	switch (network) {
		case NETWORK_LIST.BSC:
			return new BscNetwork();
		default:
			return new EthNetwork();
	}
};

/* Return the ID of the provided network enum
 * @param network = NETWORK_LIST enum of the ID you'd like to receive
 * @return int formatted network ID
 */
export const getNetworkId = (network: NETWORK_LIST | undefined): number | undefined => {
	switch (network) {
		case NETWORK_LIST.BSC:
			return NETWORK_IDS.BSC;
		case NETWORK_LIST.ETH:
			return NETWORK_IDS.ETH;
		default:
			return undefined;
	}
};

/* Return the NETWORK_LIST enum value of the provided network number
 * @param network = NETWORK_IDS enum of the name you'd like to receive
 * @return NETWORK_LIST formatted network ID
 */
export const getNetworkNameFromId = (network: NETWORK_IDS): string | null => {
	switch (network) {
		case NETWORK_IDS.BSC:
			return NETWORK_LIST.BSC;
		case NETWORK_IDS.ETH:
			return NETWORK_LIST.ETH;
		default:
			return null;
	}
};
