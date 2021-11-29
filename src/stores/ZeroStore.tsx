import { extendObservable } from 'mobx';
import type { Store } from './Store';
import type { KeeperList } from '../config/models/zero';
import { LIB_P2P_URI } from '../config/constants/zero';
import { constants } from 'ethers';
import { ethers } from 'ethers';
import { SignerWithAddress } from 'hardhat-deploy-ethers/dist/src/signers';
import { TransferRequest, createZeroConnection, createZeroKeeper, createZeroUser } from 'zero-protocol';
import { Wallet } from "@ethersproject/wallet";

require('dotenv').config()

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

		const transferRequest = new TransferRequest({
			module: '0x22d669CCDFe89080AB43505048DF471c54527C67', //Swap.address,
			to: address, //await signer.getAddress(),
			underwriter: '0x81B83D47cCD3f169c7403010F70dB722C7f1CB41', //TrivialUnderwriter.address,
			asset: '0xDBf31dF14B66535aF65AaC99C32e9eA844e14501', // renBTC on MATIC
			amount: fromAmount, //String(utils.parseUnits('0.0016', 8)),
			data: '0x',
			nonce: '0x53fc9b778460077468d2e8fd44eb0d9c66810e551c9e983569f092133f37db3e',
			pNonce: '0x36cbcf365ecad2171742b1adeecb4b3d74eb0fddb8988b690117bf550a9b19c7'
		});

		// const keeperCallback = async (msg) => {
		// 	//console.log("Transfer Request: ", msg)
		// 	try {
		// 		const tr = new TrivialUnderwriterTransferRequest(msg);
		// 		console.log(tr.nonce);
		// 		const mint = await transferRequest.submitToRenVM();
		// 		console.log(`(TransferRequest) Deposit ${utils.formatUnits(tr.amount, 8)} BTC to ${mint.gatewayAddress}`);
		// 		await new Promise((resolve, reject) => mint.on('deposit', async (deposit) => {
		// 			const hash = deposit.txHash();
		// 			const depositLog = (msg) => console.log(`RenVM Hash: ${hash}\nStatus: ${deposit.status}\n${msg}`);

		// 			await deposit
		// 				.confirmed()
		// 				.on('target', (target) => {
		// 		depositLog(`0/${target} confirmations`);
		// 		resolve(deposit);
		// 		})
		// 				.on('confirmation', (confs, target) => depositLog(`${confs}/${target} confirmations`));
		// 			await deposit.signed().on('status', (status) => depositLog(`Status: ${status}`));
		// 		}));

		// 		const waitedSignature = await tr.waitForSignature();
		// 		console.log('got signature!');
		// 		console.log(waitedSignature);
		// 		console.log('repaying');
		// 		const tx = await tr.repay(signer, { gasLimit: 500e3 });
		// 		console.log('tx submitted');
		// 		console.log(tx);
		// 		console.log('awaiting receipt');
		// 		console.log(await tx.wait());
		// 		completed.resolve();
		// 	} catch (e) {
		// 		completed.reject(e);
		// 	}
		// };

		const SIGNALING_MULTIADDR = '/dns4/lourdehaufen.dynv6.net/tcp/443/wss/p2p-webrtc-star/';

		(async () => {
			const user = (window as any).user = createZeroUser(await createZeroConnection(SIGNALING_MULTIADDR));
			const keeper = (window as any).keeper = createZeroKeeper(await createZeroConnection(SIGNALING_MULTIADDR));
			await user.conn.start();
			await keeper.conn.start();
			// await Promise.all([ user, keeper ].map(async (v) => await v.conn.start()));
			const keeperWallet = Wallet.createRandom();
			await keeper.advertiseAsKeeper(keeperWallet.address);
			await keeper.setTxDispatcher(keeperCallback);
			await user.subscribeKeepers();

			setTimeout(async () => {
				/* Update FeeDisplay with keepers found */
				if (user.keepers.length > 0) {
					this.keepers = (window as any).user.keepers;

					/* Set underwriter */
					transferRequest.setUnderwriter('0x81B83D47cCD3f169c7403010F70dB722C7f1CB41');

					/* Sign transaction */
					const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
					const privateKey = process.env.REACT_APP_WALLET;
					const wallet = new Wallet(privateKey, signer.provider);
					await transferRequest.sign(wallet, '0x8322D8a9851f8a09193529B365c35553570E5921');

					user.publishTransferRequest(transferRequest)

					/*
					* Once keeper dials back, compute deposit address and
					* display it
					*/
					const gatewayAddressInput = {
						destination: address,
						mpkh: constants.AddressZero, //XXTODO: Make sure this is correct value
						isTest: true,
					};

					const gatewayAddress = await transferRequest.toGatewayAddress(gatewayAddressInput);

					return gatewayAddress;
				}
			}, 2000);
		})().catch((err) => console.error(err));
	};
}
