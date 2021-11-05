import { extendObservable } from 'mobx';
import type { Store } from './Store';
import type { KeeperList } from '../config/models/zero';
import { LIB_P2P_URI } from '../config/constants/zero';
import { constants } from 'ethers';
import { ethers } from 'ethers';
import { SignerWithAddress } from 'hardhat-deploy-ethers/dist/src/signers';
import { TransferRequest, createZeroConnection, createZeroKeeper, createZeroUser } from 'zero-protocol';

declare const window: any;

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
		const connection = await createZeroConnection(LIB_P2P_URI);
		const user = await createZeroUser(connection);

		await user.subscribeKeepers()

		const request = new TransferRequest(
			constants.AddressZero,
			constants.AddressZero,
			constants.AddressZero,
			constants.AddressZero,
			fromAmount,
			'0x00',
		);

		// /* Sign transaction */
		const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
		const signerWithAddress = await SignerWithAddress.create(signer);
		await request.sign(signerWithAddress, '0x8322D8a9851f8a09193529B365c35553570E5921');

		user.publishTransferRequest(request)

		/*
		 * Once keeper dials back, compute deposit address and
		 * display it
		 */
		if (user.keepers.length > 0) {
			const gatewayAddressInput = {
				destination: address,
				mpkh: constants.AddressZero, //XXTODO: Make sure this is correct value
				isTest: true,
			};

			return request.toGatewayAddress(gatewayAddressInput);
		}

		return '';
	};
}
