import { extendObservable } from 'mobx';
import type { Store } from './Store';
import { LIB_P2P_URI } from '../config/constants/zero';
import { providers, constants, ethers } from 'ethers';
import { TransferRequest, createZeroUser, createZeroConnection } from 'zero-protocol/dist/lib/zero.js';
import { ZeroUser } from 'zero-protocol/dist/lib/p2p';
// @ts-ignore
import { createMockKeeper, enableGlobalMockRuntime } from 'zero-protocol/dist/lib/mock';
import deployments from 'zero-protocol/deployments/deployments.json';

export default class ZeroStore {
	private readonly store!: Store;
	public zeroUser: ZeroUser | undefined;
	private keeperListener: any | undefined;

	constructor(store: Store) {
		this.store = store;
		this.zeroUser = undefined;

		extendObservable(this, {
			zeroUser: this.zeroUser,
		});
	}

	public connectToZero = async () => {
		if (process.env.NODE_ENV !== 'production') {
			await createMockKeeper(new providers.JsonRpcProvider('http://localhost:8545'));
			await enableGlobalMockRuntime();
		}
		const connection = await createZeroConnection(LIB_P2P_URI);
		this.zeroUser = createZeroUser(connection);
		await this.zeroUser.conn.start();
		await this.zeroUser.subscribeKeepers();
		this.keeperListener = this.zeroUser.on('keeper', (address) => {
			console.log('keeper discovered with address ' + address);
		});
	};

	public disconnectFromZero = async () => {
		this.zeroUser?.removeAllListeners();
	};

	/* Utilizes the user's provider to connect to the
	 * Zero network.
	 */
	public createTransferRequest = async (address: string, fromAmount: string, toCurrency: string): Promise<any> => {
		const networkId = this.store.wallet.network.networkId;
		const networkName = this.store.wallet.network.name;
		const zeroController = deployments[networkId][networkName].contracts['ZeroController'].address;
		const underwriter = deployments[networkId][networkName].contracts['TrivialUnderwriter'].address;
		const module = deployments[networkId][networkName].contracts['Swap'].address;
		const currencyAddress = this.store.currency.tokenMapCache[toCurrency].address;

		const transferRequest = new TransferRequest({
			to: address,
			contractAddress: zeroController,
			underwriter: underwriter,
			amount: fromAmount,
			asset: currencyAddress,
			module: module,
			nonce: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
			pNonce: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
			data: '0x00',
		});

		const mint = await transferRequest.submitToRenVM(false);

		return mint;
	};
}
