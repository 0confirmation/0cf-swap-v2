import type { WalletProviderInfo } from '../config/models/wallet';
import type { NotifyOptions } from '../config/models/network';

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

export const onboardWalletCheck = [
	{ checkName: 'derivationPath' },
	{ checkName: 'accounts' },
	{ checkName: 'connect' },
];

export const notifyOptions: NotifyOptions = {
	dappId: 'af74a87b-cd08-4f45-83ff-ade6b3859a07',
	networkId: 1,
};
