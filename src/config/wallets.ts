import type { WalletProviderInfo } from '../config/models/wallet';
import type { NotifyOptions } from '../config/models/network';
import { StateAndHelpers, WalletCheckModal } from 'bnc-onboard/dist/src/interfaces';
import { NETWORK_LIST } from '../config/constants/network';
import { getNetworkNameFromId } from '../utils/network';

export const getOnboardWallets = (network: string): WalletProviderInfo[] => {
	switch (network) {
		default:
			return [
				// For now, we'll only use MM as it has no additional costs for
				// RPC providers.
				{ walletName: 'metamask' },
			];
	}
};

const supportedNetwork = () => {
	return async (stateAndHelpers: StateAndHelpers): Promise<WalletCheckModal | undefined> => {
		const { network, appNetworkId } = stateAndHelpers;
		const networkName = getNetworkNameFromId(network ?? appNetworkId);
		if (!networkName || !Object.values(NETWORK_LIST).includes(networkName as NETWORK_LIST)) {
			const networkMembers = Object.values(NETWORK_LIST).map((key) => ' '.concat(key.toUpperCase()));
			return {
				heading: `Unsupported Network`,
				description: `Switch your network to one of the supported networks:${networkMembers}`,
				eventCode: 'network',
			};
		}
	};
};

export const onboardWalletCheck = [
	supportedNetwork(),
	{ checkName: 'derivationPath' },
	{ checkName: 'accounts' },
	{ checkName: 'connect' },
];

export const notifyOptions: NotifyOptions = {
	dappId: 'af74a87b-cd08-4f45-83ff-ade6b3859a07',
	networkId: 1,
};
