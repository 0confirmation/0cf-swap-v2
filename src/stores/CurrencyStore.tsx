import { action, extendObservable } from 'mobx';
import type { ZeroStore } from './ZeroStore';
import { fetchPrices, fetchBtcExchangeRates, numberWithCommas } from '../utils/helpers';
import type { PriceSummary, ExchangeRates } from '../config/models/currency';
import type { TokenMap } from '../config/models/tokens';
import type { TokenDefinition } from '../config/constants/tokens';
import { Token } from '../config/models/tokens';
import BigNumber from 'bignumber.js';

export default class CurrencyStore {
	private readonly store!: ZeroStore;
	public btcExchangeRates: ExchangeRates | null | undefined;
	public prices: PriceSummary | null | undefined;
	public tokens: Token[];
	public tokenMapCache: TokenMap;

	constructor(store: ZeroStore) {
		this.store = store;
		this.prices = undefined;
		this.btcExchangeRates = undefined;
		this.tokenMapCache = {};

		extendObservable(this, {
			prices: undefined,
			btcExchangeRates: undefined,
			tokenMapCache: undefined,
		});

		this.tokens = this.store.wallet.network.tokens.map((token: TokenDefinition) => {
			return new Token(this.store, token.address, token.name, token.symbol, token.decimals);
		});
		this.tokenMapCache = Object.assign({}, ...this.tokens.map((token) => ({ [token.name.toLowerCase()]: token })));
		// Hardcode bitcoin into the token map as it doesn't exist on any host chains
		this.tokenMapCache['bitcoin'] = new Token(this.store, '', 'Bitcoin', 'btc', 8, new BigNumber(1));

		this.init();
	}

	init = action(async (): Promise<void> => {
		await this.loadPrices();

		// Refresh prices every minute
		setInterval(() => {
			this.loadPrices();
		}, 1000 * 60);
	});

	get tokenMap(): TokenMap | null | undefined {
		return this.tokenMapCache;
	}

	setTokenMap = action((tokenMap: TokenMap): void => {
		this.tokenMapCache = tokenMap;
	});

	loadPrices = action(async (): Promise<void> => {
		this.prices = await fetchPrices();
		this.btcExchangeRates = await fetchBtcExchangeRates();
		if (!this.prices || !this.btcExchangeRates) return;

		const newTokenMap = this.tokenMapCache;

		// We iterate through the coingecko return and assign
		// the prices to the defined tokens.
		Object.keys(this.prices).forEach((key) => {
			if (this.prices && newTokenMap[key] && !!this.prices[key]['btc']) {
				newTokenMap[key].setPrice(new BigNumber(this.prices[key]['btc']));
			}
		});

		this.setTokenMap(newTokenMap);

		// After the iteration, we set bitcoin price from exchange
		// rates as there is no token.
		this.prices['bitcoin'] = {
			usd: new BigNumber(this.btcExchangeRates.rates['usd'].value),
			eth: new BigNumber(this.btcExchangeRates.rates['eth'].value),
			cad: new BigNumber(this.btcExchangeRates.rates['cad'].value),
			btc: new BigNumber(1),
		};
	});

	public toToken = (
		value: BigNumber,
		tokenName: string,
		fromName: string,
		preferredDecimals?: number,
		noCommas = false,
	): string => {
		if (!value || value.isNaN()) value = new BigNumber(0);

		// TODO: handle loading more elegantly
		if (!this.tokenMap) return '0.00';

		const toToken = this.tokenMap[tokenName.toLowerCase()];
		const fromToken = this.tokenMap[fromName.toLowerCase()];

		if (!toToken || toToken.price.eq(0)) return '-';

		const normal = value.multipliedBy(fromToken.price).dividedBy(toToken.price);
		const decimals = preferredDecimals ?? toToken.decimals;

		const fixedNormal = noCommas
			? normal.toFixed(decimals, BigNumber.ROUND_HALF_FLOOR)
			: numberWithCommas(normal.toFixed(decimals, BigNumber.ROUND_HALF_FLOOR));

		return fixedNormal.toString();
	};
}
