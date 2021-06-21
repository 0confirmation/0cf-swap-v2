import { action, extendObservable } from 'mobx';
import type { Store } from './Store';
import {
	fetchBtcBlockHeight,
	fetchBtcConfirmationTime,
	fetchBtcPriceHistory,
	fetchPrices,
	numberWithCommas,
} from '../utils/helpers';
import type { PriceHistory, PriceSummary } from '../config/models/currency';
import type { TokenMap } from '../config/models/tokens';
import { SUPPORTED_TOKEN_NAMES, TokenDefinition } from '../config/constants/tokens';
import { Token } from '../config/models/tokens';
import BigNumber from 'bignumber.js';

export default class CurrencyStore {
	private readonly store!: Store;
	public prices: PriceSummary | null | undefined;
	public tokens: Token[];
	public tokenMapCache: TokenMap;
	public btcConfirmationTime: string | undefined;
	public btcPriceHistory: PriceHistory | undefined;
	public btcBlockHeight: number | undefined;

	constructor(store: Store) {
		this.store = store;
		this.prices = undefined;
		this.tokenMapCache = {};
		this.tokens = [];
		this.btcConfirmationTime = undefined;
		this.btcPriceHistory = undefined;
		this.btcBlockHeight = undefined;

		extendObservable(this, {
			prices: undefined,
			tokenMapCache: undefined,
			btcConfirmationTime: undefined,
			btcPriceHistory: undefined,
			btcBlockHeight: undefined,
		});
		this.init();
	}

	init = action(async (): Promise<void> => {
		this.setTokens();
		await this.loadPrices();
		await this.loadBtcBlockTime();
		await this.loadBtcBlockHeight();
	});

	get tokenMap(): TokenMap | null | undefined {
		return this.tokenMapCache;
	}

	setTokens = action(() => {
		this.tokens = this.store.wallet.network.tokens.map((token: TokenDefinition) => {
			return new Token(this.store, token.address, token.name, token.symbol, token.decimals);
		});
		this.tokenMapCache = Object.assign({}, ...this.tokens.map((token) => ({ [token.name]: token })));
	});

	setTokenMap = action((tokenMap: TokenMap): void => {
		this.tokenMapCache = tokenMap;
	});

	setPrices = action((prices: PriceSummary | null): void => {
		if (prices) this.prices = prices;
	});

	setTokenPrice = action((token: Token, price: BigNumber): void => {
		token.setPrice(price);
	});

	setBtcConfirmationTime = action((time: string): void => {
		this.btcConfirmationTime = time;
	});

	setBtcPriceHistory = action((prices: PriceHistory | undefined) => {
		this.btcPriceHistory = prices;
	});

	setBtcBlockHeight = action((blockHeight: number | undefined) => {
		this.btcBlockHeight = blockHeight;
	});

	loadPrices = action(async (): Promise<void> => {
		if (this.store.wallet.loading) return;
		this.setPrices(await fetchPrices(this.store));
		if (!this.prices) return;

		const newTokenMap = this.tokenMapCache;

		// We iterate through the coingecko return and assign
		// the prices to the defined tokens.
		Object.keys(this.prices).forEach((key) => {
			if (this.prices && newTokenMap[key] && !!this.prices[key]) {
				this.setTokenPrice(newTokenMap[key], this.prices[key]);
			}
		});

		this.setTokenMap(newTokenMap);
	});

	loadBtcBlockTime = action(async (): Promise<void> => {
		const confirmationTime = await fetchBtcConfirmationTime();
		this.setBtcPriceHistory(await fetchBtcPriceHistory(confirmationTime));
		this.setBtcConfirmationTime(confirmationTime);
	});

	loadBtcBlockHeight = action(async (): Promise<void> => {
		this.setBtcBlockHeight(await fetchBtcBlockHeight());
	});

	/* toToken accepts a value, input token and output token name and formatting options
	 * and returns a string formatted in the requested way.
	 * @param value = BigNumber of the amount of the fromName token
	 * @param tokenName = Name of token you want to convert to - TODO: Make token name enum
	 * @param fromName = Name of token you're converting from
	 * @param preferredDecimals (optional) = Precision of decimals, defaults to tokenName decimals
	 * @param noCommas (optional) = defaults to false, set true to return the number formatted with no commas
	 */
	public toToken = (
		value: BigNumber,
		tokenName: string,
		fromName: string,
		preferredDecimals?: number,
		noCommas = false,
	): string => {
		if (!value || value.isNaN()) value = new BigNumber(0);

		// TODO: handle loading more elegantly
		if (!this.prices || !this.tokenMap) return '0.00';

		const toPrice = this.prices[tokenName];
		const fromPrice = this.prices[fromName];

		if (!toPrice || !fromPrice) return '0.00';

		const normal =
			fromName !== SUPPORTED_TOKEN_NAMES.WBTC
				? value.multipliedBy(toPrice.dividedBy(fromPrice))
				: value.multipliedBy(toPrice);
		const decimals = preferredDecimals ?? this.tokenMap[tokenName].decimals;

		const fixedNormal = noCommas
			? normal.toFixed(decimals, BigNumber.ROUND_HALF_FLOOR)
			: numberWithCommas(normal.toFixed(decimals, BigNumber.ROUND_HALF_FLOOR));

		return fixedNormal.toString();
	};
}
