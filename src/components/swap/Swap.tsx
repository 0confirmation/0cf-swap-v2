import React, { useContext, useEffect, useState } from 'react';
import { Grid, Container, Paper } from '@material-ui/core';
import { DRAWER_WIDTH } from '../../config/constants/ui';
import { navHeight } from '../common/Navbar/Navbar';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { StoreContext } from '../../stores/ZeroStore';
import { observer } from 'mobx-react-lite';
import { SUPPORTED_TOKEN_NAMES } from '../../config/constants/tokens';
import SwapFrom from './SwapFrom';
import SwapTo from './SwapTo';
import PaymentButton from './PaymentButton';
import FeeDisplay from './FeeDisplay';
import StatsDisplay from './StatsDisplay';
import { BigNumber } from 'bignumber.js';
import { fetchTrade, numberWithCommas, valueAfterFees } from '../../utils/helpers';
import { TradeType } from '@sushiswap/sdk';

const useStyles = makeStyles((theme: Theme) => ({
	mainContainer: {
		// Reason: typescript doesn't allow for custom classes on material-ui
		// @ts-ignore
		background: `radial-gradient(circle at 50%, ${theme.palette.custom.backgroundCircle}, ${theme.palette.background.default} 50%)`,
		[theme.breakpoints.up('md')]: {
			paddingLeft: DRAWER_WIDTH + 48,
			// @ts-ignore
			background: `radial-gradient(circle at 60%, ${theme.palette.custom.backgroundCircle}, ${theme.palette.background.default} 50%)`,
		},
		paddingTop: `${navHeight + 1.5}rem`,
		[theme.breakpoints.down('sm')]: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			paddingLeft: 0,
			paddingRight: 0,
		},
	},
	swapContainer: {
		paddingBottom: theme.spacing(6),
		justifyContent: 'center',
		display: 'flex',
	},
	infoPaper: {
		padding: theme.spacing(2),
	},
	descriptionContainer: {
		paddingTop: theme.spacing(6),
	},
}));

/*
 * Retrieves the balance of the liquidity pool from the Zero protocol
 * @param zero = instance of the Zero SDK class
 */
const getLiquidity = async (zero: any) => {
	if (!zero) return;
	const { makeManagerClass } = require('@0confirmation/eth-manager');
	const ERC20 = makeManagerClass(require('@0confirmation/sol/build/DAI')); // will make an ethers.js wrapper compatible with DAI, which is a mock token that exports the ERC20 ABI
	const environments = require('@0confirmation/sdk/environments');
	const mainnet = environments.getAddresses('mainnet');
	const renbtc = new ERC20(mainnet.renbtc, zero.getProvider().asEthers());

	const zeroBTC = await zero.getLiquidityTokenFor(mainnet.renbtc);
	const liquidityPoolRenBTCHoldings = await renbtc.balanceOf(zeroBTC.address);
	console.log(String(liquidityPoolRenBTCHoldings));
};

export const Swap = observer(() => {
	const classes = useStyles();
	const store = useContext(StoreContext);
	const {
		wallet: { zero },
		currency: { loadPrices },
		fees: { gasFee, getAllFees },
	} = store;

	const [selectedCoin, setSelectedCoin] = useState(SUPPORTED_TOKEN_NAMES.USDC);
	const [toAmount, setToAmount] = useState('0');
	const [fromAmount, setFromAmount] = useState('0');
	const [priceImpact, setPriceImpact] = useState('0');
	const [updateSide, setUpdateSide] = useState('from');
	const inputCurrency = 'BTC';

	// If fees or price changes, we update the amounts displayed based
	// on what the user had updated last
	const noChangeAmountUpdate = (): void => {
		switch (updateSide) {
			case 'to':
				handleToAmount(toAmount);
				break;
			default:
				handleFromAmount(fromAmount);
		}
	};

	// Update our outputed from amount with new fees when gas fee changes
	useEffect(() => {
		noChangeAmountUpdate();
		/* eslint-disable */
	}, [gasFee, selectedCoin]);

	/* On change of the zero class, check if the user is connected
	 * if so, set an interval to regularly update the liquidity
	 * pool holdings.
	 */
	useEffect(() => {
		const liquidityInterval = setInterval(() => {
			Promise.all([getLiquidity(zero)]);
		}, 1000 * 360);
		if (zero) {
			Promise.all([getLiquidity(zero)]);
		} else {
			clearInterval(liquidityInterval);
		}
	}, [zero]);

	const handleSelectedCoin = async (name: SUPPORTED_TOKEN_NAMES) => {
		setSelectedCoin(name);
		handleFromAmount(fromAmount);
	};

	const handleToAmount = async (amount: string) => {
		setUpdateSide('to');
		setToAmount(amount);
		await loadPrices();

		const bnAmount = new BigNumber(amount);
		const fees = new BigNumber(getAllFees(store, bnAmount, selectedCoin) ?? 0);
		const tradeAmount = bnAmount.plus(fees);

		const trade = await fetchTrade(
			store,
			SUPPORTED_TOKEN_NAMES.WBTC,
			selectedCoin,
			tradeAmount,
			TradeType.EXACT_OUTPUT,
		);

		if (trade) {
			const value = tradeAmount.dividedBy(new BigNumber(trade.executionPrice.toFixed(6)));
			setPriceImpact(trade.priceImpact.toSignificant(2));
			value && value.gt(0)
				? setFromAmount(numberWithCommas(value.toFixed(4, BigNumber.ROUND_HALF_FLOOR)))
				: setFromAmount('0');
		}
	};

	const handleFromAmount = async (amount: string) => {
		setUpdateSide('from');
		setFromAmount(amount);
		await loadPrices();

		const bnAmount = new BigNumber(amount);
		const trade = bnAmount.gt(0)
			? await fetchTrade(store, SUPPORTED_TOKEN_NAMES.WBTC, selectedCoin, bnAmount, TradeType.EXACT_INPUT)
			: undefined;

		if (trade) {
			const executionAmount = bnAmount.multipliedBy(new BigNumber(trade.executionPrice.toFixed(6)));
			const value = valueAfterFees(store, executionAmount, selectedCoin, 4);
			setPriceImpact(trade.priceImpact.toSignificant(2));
			value && parseFloat(value) > 0 ? setToAmount(value) : setToAmount('0');
		} else if (updateSide === 'to') {
			setPriceImpact('0');
		} else {
			setToAmount('0');
			setPriceImpact('0');
		}
	};

	return (
		<Container className={classes.mainContainer}>
			<Grid item className={classes.swapContainer}>
				<Grid item xs={12} sm={8}>
					<Paper className={classes.infoPaper}>
						<SwapFrom amount={fromAmount} handleFromAmount={handleFromAmount} />
						<SwapTo onTokenChange={handleSelectedCoin} amount={toAmount} handleToAmount={handleToAmount} />
						<PaymentButton
							fromAmount={fromAmount}
							toAmount={toAmount}
							fromCurrency={inputCurrency}
							toCurrency={selectedCoin}
							priceImpact={priceImpact}
						/>
						<FeeDisplay selectedCoin={selectedCoin} amount={fromAmount} priceImpact={priceImpact} />
					</Paper>
				</Grid>
			</Grid>
			<StatsDisplay />
		</Container>
	);
});
