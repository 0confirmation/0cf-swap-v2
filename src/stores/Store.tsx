import { RouterStore } from 'mobx-router';
import { createContext } from 'react';
import WalletStore from './WalletStore';
import UiStore from './UiStore';
import CurrencyStore from './CurrencyStore';
import FeeStore from './FeeStore';
import ZeroStore from './ZeroStore';

export class Store {
	public router: RouterStore<Store>;
	public wallet: WalletStore;
	public ui: UiStore;
	public currency: CurrencyStore;
	public fees: FeeStore;
	public zero: ZeroStore;

	constructor() {
		this.router = new RouterStore<Store>(this);
		this.wallet = new WalletStore(this);
		this.ui = new UiStore(this);
		this.currency = new CurrencyStore(this);
		this.fees = new FeeStore(this);
		this.zero = new ZeroStore(this);
	}

	async storeRefresh(): Promise<void> {
		if (!this.wallet.connectedAddress) return;
		const chain = await this.wallet.provider?.getNetwork();

		if (chain) {
			const refreshData = [
				this.currency.setTokens(),
				this.currency.loadPrices(),
				this.currency.loadBtcBlockTime(),
				this.currency.loadBtcBlockHeight(),
				this.fees.setFees(),
			];
			await Promise.all(refreshData);
		}
	}
}

const store = new Store();

export const StoreContext = createContext({} as Store);
export const StoreProvider = StoreContext.Provider;

export default store;
