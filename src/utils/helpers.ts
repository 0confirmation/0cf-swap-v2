import type { PriceHistory, PriceSummary } from '../config/models/currency';
import BigNumber from 'bignumber.js';
import type { Store } from '../stores/Store';
import { SUPPORTED_TOKEN_NAMES } from '../config/constants/tokens';
import { ethers } from 'ethers';
import { API } from 'bnc-onboard/dist/src/interfaces';
import { TradeType } from '../config/models/sushi';

// ============== BTC HELPERS ==============

/* Returns the most recent price and the price that is as close to 6 confirmations away from current price
 * @param confirmationTime = time in minutes that it takes for 6 confirmation
 * @return Current price and the price from now - confirmationTime
 */
export const fetchBtcPriceHistory = async (confirmationTime: string): Promise<PriceHistory | undefined> => {
	const numConfTime = parseFloat(confirmationTime);
	if (isNaN(numConfTime)) return undefined;
	const oldPriceIndex = Math.ceil(numConfTime / 5) + 1;

	const cgResponse: number[] | null = await fetchData(() =>
		fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=.1&interval=minute'),
	);
	const prices = cgResponse ? cgResponse['prices'] : undefined;

	// Coingecko returns data in oldest -> newest format so we pull data from the end
	return prices
		? {
				currentPrice: new BigNumber(prices[prices.length - 1][1]),
				oldPrice: new BigNumber(prices[prices.length - oldPriceIndex][1]),
		  }
		: undefined;
};

/* Returns the most recent block height of the longest chain on the BTC blockchain.
 * @return current block height of BTC
 */
export const fetchBtcBlockHeight = async (): Promise<number | undefined> => {
	const response: number | null | undefined = await fetchData(() => fetch('https://blockchain.info/q/getblockcount'));
	return response ?? undefined;
};

/* Pulls the average block length in minutes and returns the time it takes for 6 confirmations on average
 * @return BTC confirmation time * 6 (globally accepted confirmation length for "finality")
 */
export const fetchBtcConfirmationTime = async (): Promise<string> => {
	const stats: { [key: string]: string } | null = await fetchData(() =>
		fetch(`https://blockchain.info/stats?format=json&cors=true`),
	);

	const blockLengthMinutes = stats ? parseFloat(stats['minutes_between_blocks']) : 60;
	return (blockLengthMinutes * 6).toFixed(1);
};

// ============== SUSHI HELPERS ==============

/* Fetches the prices for all supported tokens and returns an object of the current market prices
 * for each token
 * NOTE: this pricing is not execution price and should only be used for displaying current price.
 * @param store = store instance to get network specific data and sushi tokens
 * @return keyed object with token name -> token price pairs
 */
export const fetchPrices = async (store: Store): Promise<PriceSummary | null> => {
	let prices = {};
	if (!store.currency || !store.wallet) {
		setTimeout(async () => {
			store.storeRefresh();
		}, 1000);
		return null;
	}
	const {
		wallet: {
			provider,
			network: { tokens, sushiRouter, sushiRouterAbi },
		},
	} = store;

	if (!provider) return null;

	await Promise.all(
		tokens.map(async (token) => {
			const route = token.inRoute;
			const router = new ethers.Contract(sushiRouter, sushiRouterAbi, provider);
			if (route.length < 2) {
				prices[token.name] = new BigNumber('1.00');
				return;
			}
			const routerOutput = await router.getAmountsOut('100000000', route);
			prices[token.name] = new BigNumber(
				new BigNumber(routerOutput[routerOutput.length - 1]['_hex']).div(10 ** token.decimals).toFixed(2),
			);
		}),
	);
	return prices;
};

/* Get the trade data for a provided pair based on input or output trading type
 * @param store = store holding network data
 * @param fromName = name of token we're swapping from
 * @param tokenName = name of token we're swapping to
 * @param amount = BigNumber amount we're swapping from in from token
 * @return average execution price of the trade
 */
export const fetchTrade = async (
	store: Store,
	toName: SUPPORTED_TOKEN_NAMES,
	fromName: SUPPORTED_TOKEN_NAMES = SUPPORTED_TOKEN_NAMES.WBTC,
	amount: BigNumber,
	type: TradeType,
): Promise<BigNumber | undefined> => {
	const {
		wallet: {
			provider,
			network: { tokenMap, sushiRouter, sushiRouterAbi },
		},
	} = store;

	const inputToken = tokenMap[toName];
	const outputToken = tokenMap[fromName];
	const router = new ethers.Contract(sushiRouter, sushiRouterAbi, provider);

	let price;
	if (type === TradeType.Out) {
		const routerOutput = await router.getAmountsOut(
			amount
				.multipliedBy(10 ** inputToken.decimals)
				.toFixed(0)
				.toString(),
			outputToken.inRoute,
		);
		price = new BigNumber(
			new BigNumber(routerOutput[routerOutput.length - 1]['_hex']).div(10 ** outputToken.decimals).toFixed(2),
		);
	} else {
		const routerOutput = await router.getAmountsIn(
			amount
				.multipliedBy(10 ** outputToken.decimals)
				.toFixed(0)
				.toString(),
			outputToken.inRoute,
		);
		price = new BigNumber(new BigNumber(routerOutput[0]['_hex']).div(10 ** inputToken.decimals).toFixed(2));
	}
	return price;
};

// ============== ZERO HELPERS ==============

/* Calcualte the output of the Zero Swap after fees are applied
 * @param store = Store instance for network specifics
 * @param amount = BigNumber execution price of the swap
 * @param decimals = amount of decimals to format the string to
 * @param noCommas = boolean to flag if the return should be comma formatted
 * @return string formatted estimation of value after fees
 */
export const valueAfterFees = (
	store: Store,
	amount: BigNumber,
	currency: SUPPORTED_TOKEN_NAMES,
	decimals = 8,
	noCommas = false,
): string | null => {
	const fees = store.fees.getAllFees(store, amount, currency);
	const finalAmount = amount.minus(fees ?? new BigNumber(0));

	return noCommas
		? finalAmount.toFixed(decimals, BigNumber.ROUND_HALF_FLOOR).toString()
		: numberWithCommas(finalAmount.toFixed(decimals, BigNumber.ROUND_HALF_FLOOR)).toString();
};

// ============== GENERAL HELPERS ==============

/* Breaks down a provided number and inserts appropriately placed commas to make a number more human readable
 * @param x = string formatted number to modify with commas
 * @return comma formatted number as a string
 */
export const numberWithCommas = (x: string): string => {
	const parts = x.split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
};

/* Takes an input value and the old value and performs type coercion from string to
 * a BigNumber.  If it's not a valid input, returns the old value.
 * @param newValue = String input from an onChange event
 * @param oldValue = Previous value to revert to if an invalid input
 * @return string formatted number
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

/* Easy interface to check to see if wallet selection is handled and ready to connect
 * via onboard.js.  To be reused if connect buttons are displayed in multiple components
 * @param onboard = instance of the onboard.js API
 * @param connect = connect function from the wallet store
 */
export const connectWallet = async (onboard: API, connect: (wsOnboard: any) => Promise<void>): Promise<void> => {
	const walletSelected = await onboard.walletSelect();
	if (walletSelected && onboard.getState().network) {
		const readyToTransact = await onboard.walletCheck();
		if (readyToTransact) {
			await connect(onboard);
		}
	}
};

/* Clear intervals
 * @param interval = Interval set in code that you'd like to cancel
 */
export const cancelInterval = (interval: NodeJS.Timeout | undefined): void => {
	if (interval) clearInterval(interval);
};

/* Shorten provided address to make readable on screen
 * @param address = Address you'd like to shorten
 * @param length (optional) = length of characters to show on either side
 * @return string formatted to provided length of digits on either side, default 5
 */
export const shortenAddress = (address: string, length: number = 5) => {
	return address.slice(0, length) + '...' + address.slice(address.length - length, address.length);
};

/* General purpose fetch that returns a JSON formatted response or null if there's an error
 * @param request = Promise to await
 * @return JSON formatted response
 */
export const fetchData = async <T>(request: () => Promise<Response>): Promise<T | null> => {
	try {
		const response = await request();
		if (!response.ok) {
			return null;
		}
		// purposefully await to use try / catch
		return await response.json();
	} catch (err) {
		console.log('error', err);
		return null;
	}
};
