import React, { ChangeEvent, MouseEvent, useContext, useEffect, useState } from 'react';
import { Grid, Paper } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { StoreContext } from '../../stores/Store';
import { observer } from 'mobx-react-lite';
import { SUPPORTED_TOKEN_NAMES } from '../../config/constants/tokens';
import SwapFrom from './SwapFrom';
import SwapTo from './SwapTo';
import PaymentButton from './PaymentButton';
import FeeDisplay from './FeeDisplay';
import StatsDisplay from './StatsDisplay';
import { BigNumber } from 'bignumber.js';
import { fetchTrade, numberWithCommas, valueAfterFees } from '../../utils/helpers';
import { TradeType } from '../../config/models/sushi';
import { GasReserve } from './GasReserve';
import { MainContainer, PaperContainer } from '../common/Styles';

const useStyles = makeStyles((theme: Theme) => ({
	infoPaper: {
		padding: theme.spacing(2),
	},
	descriptionContainer: {
		paddingTop: theme.spacing(6),
	},
}));

export const Swap = observer(() => {
	const classes = useStyles();
	const store = useContext(StoreContext);
	const {
		currency: { loadPrices },
		fees: { gasFee, getAllFees },
	} = store;

	const [selectedCoin, setSelectedCoin] = useState(SUPPORTED_TOKEN_NAMES.USDC);
	const [toAmount, setToAmount] = useState('0');
	const [fromAmount, setFromAmount] = useState('0');
	const [priceImpact, setPriceImpact] = useState('0');
	const [updateSide, setUpdateSide] = useState('from');
	const [checked, setChecked] = useState(false);
	const [reserveAmount, setReserveAmount] = useState(0);
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
	// useEffect(() => {
	// 	const liquidityInterval = setInterval(() => {
	// 		Promise.all([getLiquidity(zero)]);
	// 	}, 1000 * 360);
	// 	if (zero) {
	// 		Promise.all([getLiquidity(zero)]);
	// 	} else {
	// 		clearInterval(liquidityInterval);
	// 	}
	// }, [zero]);

	const handleSelectedCoin = async (name: SUPPORTED_TOKEN_NAMES) => {
		setSelectedCoin(name);
	};

	const handleToAmount = async (amount: string) => {
		setUpdateSide('to');
		setToAmount(amount);
		await loadPrices();

		const bnAmount = new BigNumber(amount);
		// TODO: Make this dynamic based on input token
		const fees = new BigNumber(getAllFees(store, bnAmount, selectedCoin) ?? 0);
		const tradeAmount = bnAmount.plus(fees);

		// TODO: Make this dynamic based on input token
		const trade = await fetchTrade(store, SUPPORTED_TOKEN_NAMES.WBTC, selectedCoin, tradeAmount, TradeType.In);

		if (trade) {
			const value = new BigNumber(trade.toFixed(6));
			setPriceImpact('0');
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
			? await fetchTrade(store, SUPPORTED_TOKEN_NAMES.WBTC, selectedCoin, bnAmount, TradeType.Out)
			: undefined;

		if (trade) {
			const executionAmount = new BigNumber(trade.toFixed(6));
			const value = valueAfterFees(store, executionAmount, selectedCoin, 4);
			setPriceImpact('0');
			value && parseFloat(value) > 0 ? setToAmount(value) : setToAmount('0');
		} else if (updateSide === 'to') {
			setPriceImpact('0');
		} else {
			setToAmount('0');
			setPriceImpact('0');
		}
	};

	const handleChecked = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
		setChecked(checked);
		// If the user checks the box, set their initial reserve amount, else clear it
		if (checked) {
			setReserveAmount(0.01);
		} else {
			setReserveAmount(0);
		}
	};

	const handleReserveAmount = (_: MouseEvent<HTMLElement, globalThis.MouseEvent>, amount: number) => {
		if (amount !== null) setReserveAmount(amount);
	};
	return (
		<MainContainer>
			<PaperContainer>
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
						<GasReserve
							checked={checked}
							reserveAmount={reserveAmount}
							handleChecked={handleChecked}
							handleReserveAmount={handleReserveAmount}
						/>
						<FeeDisplay selectedCoin={selectedCoin} amount={fromAmount} priceImpact={priceImpact} />
					</Paper>
				</Grid>
			</PaperContainer>
			<StatsDisplay />
		</MainContainer>
	);
});
