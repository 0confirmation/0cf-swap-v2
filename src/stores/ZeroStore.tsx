import { extendObservable } from 'mobx';
import type { Store } from './Store';
import { LIB_P2P_URI } from '../config/constants/zero';
import { providers, constants } from 'ethers';
import { TransferRequest, createZeroUser, createZeroConnection } from 'zero-protocol/dist/lib/zero.js';
import { ZeroUser } from 'zero-protocol/dist/lib/p2p';
// @ts-ignore
import { createMockKeeper, enableGlobalMockRuntime } from 'zero-protocol/dist/lib/mock';

export default class ZeroStore {
	private readonly store!: Store;
	public zeroUser: ZeroUser | undefined;

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
		this.zeroUser.on('keeper', (address) => {
			console.log('keeper discovered with address ' + address);
		});
	};

	/* Utilizes the user's provider to connect to the
	 * Zero network.
	 */
	public createTransferRequest = async (address: string, fromAmount: string): Promise<string> => {
		const transferRequest = new TransferRequest({
			to: address,
			contractAddress: constants.AddressZero,
			underwriter: constants.AddressZero,
			module: constants.AddressZero,
			asset: constants.AddressZero,
			amount: fromAmount,
			data: '0x00',
		});

		// const zeroConnectionOne = await createZeroConnection(LIB_P2P_URI);
		// const zeroConnectionTwo = await createZeroConnection(LIB_P2P_URI);
		// const zeroUser = createZeroUser(zeroConnectionOne);
		// const zeroKeeper = createZeroKeeper(zeroConnectionTwo);

		// await zeroKeeper.advertiseAsKeeper(address);
		// await zeroUser.subscribeKeepers();

		// /* Sign transaction */
		// // const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner(0);
		// // await transferRequest.sign(signer);

		// await zeroUser.publishTransferRequest(transferRequest);

		/*
		 * Once keeper dials back, compute deposit address and
		 * display it
		 */
		const gatewayAddressInput = {
			destination: address,
			mpkh: constants.AddressZero, //XXTODO: Get correct value
			isTest: true,
		};

		return transferRequest.toGatewayAddress(gatewayAddressInput);
	};
}
