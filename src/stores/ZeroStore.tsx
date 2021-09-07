import { extendObservable } from 'mobx';
import type { Store } from './Store';
import type { KeeperList } from '../config/models/zero';
import { LIB_P2P_URI } from '../config/constants/zero';
import { constants } from 'ethers';
import TransferRequest, { createZeroConnection, createZeroKeeper, createZeroUser } from 'zero-protocol';

export default class ZeroStore {
	private readonly store!: Store;
	public keepers: KeeperList | undefined;

	constructor(store: Store) {
		this.store = store;
		this.keepers = undefined;

		extendObservable(this, {
			keepers: undefined,
		});
	}

	/* Utilizes the user's provider to connect to the
	 * Zero network.
	 */
	public createTransferRequest = async (address: string, fromAmount: string): Promise<string> => {
		const transferRequest = new TransferRequest(
			constants.AddressZero,
			constants.AddressZero,
			constants.AddressZero,
			constants.AddressZero,
			fromAmount,
			'0x00',
		);

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
