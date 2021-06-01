import type { PriceSummary, ExchangeRates } from '../config/models/currency';
import BigNumber from 'bignumber.js';
import type { ZeroStore } from '../stores/ZeroStore';
import { getSushiToken, SUPPORTED_TOKEN_NAMES } from '../config/constants/tokens';
import { Route as SushiRoute, Fetcher, WETH } from '@sushiswap/sdk';
import { BaseProvider } from '@ethersproject/providers';

export const fetchData = async <T>(request: () => Promise<Response>): Promise<T | null> => {
	try {
		const response = await request();
		if (!response.ok) {
			return null;
		}
		// purposefully await to use try / catch
		return await response.json();
	} catch {
		return null;
	}
};

/* Fetches the pair data from sushiswap and calculates current pricing for all supported pairs
 * @param store = store instance to get network specific data and sushi tokens
 */
export const fetchPrices = async (store: ZeroStore): Promise<PriceSummary | null> => {
	let prices = {};
	for (const token in SUPPORTED_TOKEN_NAMES) {
		const tokenName = SUPPORTED_TOKEN_NAMES[token];
		if (tokenName === SUPPORTED_TOKEN_NAMES.WBTC) break;
		const network = store.wallet.network.networkId;

		// Reason: WETH is indexed by number, TS is throwing an error here incorrectly.
		//@ts-ignore
		const weth = WETH[network];
		const btc = getSushiToken(SUPPORTED_TOKEN_NAMES.WBTC, store);
		const wantToken = getSushiToken(tokenName, store);

		if (!btc || !weth || !wantToken || !store.wallet.connectedAddress) break;

		const wBTCwETHPair = await Fetcher.fetchPairData(btc, weth, store.wallet.provider as BaseProvider);
		let wantwETHPair = undefined;
		if (tokenName !== SUPPORTED_TOKEN_NAMES.ETH) {
			wantwETHPair = await Fetcher.fetchPairData(wantToken, weth, store.wallet.provider as BaseProvider);
		}

		const route = !!wantwETHPair
			? new SushiRoute([wBTCwETHPair, wantwETHPair], btc)
			: new SushiRoute([wBTCwETHPair], btc);

		prices[tokenName.toLowerCase()] = new BigNumber(route.midPrice.toFixed(2));
	}

	return prices;
};

export const fetchBtcExchangeRates = async (): Promise<ExchangeRates | null> => {
	return fetchData(() => fetch('https://api.coingecko.com/api/v3/exchange_rates'));
};

// Breaks down a provided number and inserts appropriately placed
// commas to make a number more human readable
export const numberWithCommas = (x: string): string => {
	const parts = x.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
};

/* Takes an input value and the old value and performs type coercion from string to
 * a BigNumber.  If it's not a valid input, returns the old value.
 * @param newValue = String input from an onChange event
 * @param oldValue = Previous value to revert to if an invalid input
 */
export const coerceInputToNumber = (newValue: string, oldValue: string) => {
	// Format to add a leading zero in front of decimals
	if (newValue === '.') newValue = '0.';

	// Format to remove leading zeros
	if (newValue.length >= 2 && newValue[0] === '0' && newValue[1] !== '.') newValue = newValue.substring(1);

	if (newValue === '') {
		return '0';
	}
	if (isNaN(newValue as unknown as number)) {
		return oldValue;
	} else {
		return newValue;
	}
};
