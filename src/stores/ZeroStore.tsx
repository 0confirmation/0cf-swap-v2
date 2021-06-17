import { action, extendObservable } from 'mobx';
import type { Store } from './Store';
import type Zero from '@0confirmation/sdk';
import type { KeeperList } from '../config/models/zero';
import { cancelInterval } from '../utils/helpers';

export default class ZeroStore {
	private readonly store!: Store;
	public zero: typeof Zero | undefined;
	public keepers: KeeperList | undefined;
	private emitterInterval: NodeJS.Timeout | undefined;

	constructor(store: Store) {
		this.store = store;
		this.keepers = undefined;
		this.zero = undefined;
		this.emitterInterval = undefined;

		extendObservable(this, {
			keepers: undefined,
			zero: undefined,
		});
	}

	private setKeepers = action((keeperList: KeeperList): void => {
		this.keepers = keeperList;
	});

	/* Utilizes the user's provider to connect to the
	 * Zero network.
	 */
	public setZero = action(async (provider: any) => {
		if (!provider) {
			this.zero = undefined;
			cancelInterval(this.emitterInterval);
			return;
		}
		const Zero = require('@0confirmation/sdk');
		this.zero = new Zero(provider, 'mainnet');
		await this.zero.initializeDriver();
		const emitter = this.zero.createKeeperEmitter();
		emitter.poll();
		emitter.on('keeper', (address: string) => {
			console.log('keeper', address);
			this.setKeepers({
				[address]: true,
				...this.keepers,
			});
		});
		this.emitterInterval = setInterval(() => {
			this.setKeepers({});
			emitter.poll();
		}, 120e3);
	});
}
