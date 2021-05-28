import type { PriceSummary, ExchangeRates } from '../config/models/currency';
import BigNumber from 'bignumber.js';
import type { ZeroStore } from '../stores/ZeroStore';

const mockPrices: { [name: string]: BigNumber } = {
	btc: new BigNumber(0),
	usd: new BigNumber(0),
	eth: new BigNumber(0),
	cad: new BigNumber(0),
};

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

export const fetchPrices = async (): Promise<PriceSummary | null> => {
	return fetchData(() =>
		fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,dai,usd-coin&vs_currencies=btc,usd,cad,eth'),
	);
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

// Takes a value in a provided token and outputs that amount in
// a selected currency.
// input: value in token
// output: value in currency
export const toCurrency = (
	store: ZeroStore,
	value: BigNumber,
	currency: string,
	fromName: string,
	hide = false,
	preferredDecimals?: number,
	noCommas = false,
): string => {
	if (!value || value.isNaN())
		return toCurrency(store, new BigNumber(0), currency, fromName, hide, preferredDecimals);

	// TODO: handle loading more elegantly
	if (!store.currency.prices || !store.currency.btcExchangeRates) return '0.00';

	let normal = value;
	let prefix = !hide ? '₿ ' : '';
	let decimals = 5;

	const prices = store.currency.prices[fromName.toLowerCase()] ?? mockPrices;

	switch (currency) {
		case 'btc':
			normal = normal.multipliedBy(prices.btc);
			decimals = preferredDecimals ?? decimals;
			break;
		case 'usd':
			normal = normal.multipliedBy(prices.usd);
			decimals = preferredDecimals ?? 2;
			prefix = '$';
			break;
		case 'eth':
			prefix = 'Ξ ';
			decimals = preferredDecimals ?? decimals;
			normal = normal.multipliedBy(prices.eth);
			break;
		case 'cad':
			normal = normal.multipliedBy(prices.cad);
			decimals = preferredDecimals ?? 2;
			prefix = 'C$';
			break;
	}

	let suffix = '';

	if (normal.gt(0) && normal.lt(10 ** -decimals)) {
		normal = normal.multipliedBy(10 ** decimals);
		suffix = `e-${decimals}`;
	}

	const fixedNormal = noCommas
		? normal.toFixed(decimals, BigNumber.ROUND_HALF_FLOOR)
		: numberWithCommas(normal.toFixed(decimals, BigNumber.ROUND_HALF_FLOOR));

	return `${prefix}${fixedNormal}${suffix}`;
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
