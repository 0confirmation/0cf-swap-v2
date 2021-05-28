import React, { useContext, useEffect, useState } from 'react';
import { Grid, Container, Paper } from '@material-ui/core';
import { DRAWER_WIDTH } from '../../config/constants/ui';
import { navHeight } from '../common/Navbar/Navbar';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { StoreContext } from '../../stores/ZeroStore';
import { observer } from 'mobx-react-lite';
import { SUPPORTED_TOKEN_NAMES } from '../../config/constants/tokens';
import { Route as SushiRoute, Pair, TokenAmount, Trade, TradeType } from '@sushiswap/sdk';
import { getSushiToken } from '../../config/constants/tokens';
import SwapFrom from './SwapFrom';
import SwapTo from './SwapTo';
import PaymentButton from './PaymentButton';
import FeeDisplay from './FeeDisplay';
import StatsDisplay from './StatsDisplay';
import { BigNumber } from 'bignumber.js';

const useStyles = makeStyles((theme: Theme) => ({
	mainContainer: {
		background: 'radial-gradient(circle at 50%, #121A31, #0d0415 50%)',
		[theme.breakpoints.up('md')]: {
			paddingLeft: DRAWER_WIDTH + 48,
			background: 'radial-gradient(circle at 60%, #121A31, #0d0415 50%)',
		},
		paddingTop: `${navHeight + 1.5}rem`,
		[theme.breakpoints.down('sm')]: {
			marginLeft: '8px',
			marginRight: '8px',
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
		wallet: { zero, connectedAddress },
		currency: { tokenMap },
		fees: { gasFee },
	} = store;

	const btc = getSushiToken(SUPPORTED_TOKEN_NAMES.RENBTC, store);
	const weth = getSushiToken(SUPPORTED_TOKEN_NAMES.ETH, store);

	const [selectedCoin, setSelectedCoin] = useState(SUPPORTED_TOKEN_NAMES.USDC);
	const [toAmount, setToAmount] = useState('0');
	const [fromAmount, setFromAmount] = useState('0');
	const [route, setRoute] = useState<SushiRoute | undefined>(undefined);
	console.log('route', route);

	// Update our outputed from amount with new fees when gas fee changes
	useEffect(() => {
		handleFromAmount(fromAmount);
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
		/* TODO: Finish sushi SDK */
		const want = getSushiToken(name, store);

		if (!!btc && !!weth && !!want) {
			const newRoute = new SushiRoute(
				[
					new Pair(new TokenAmount(btc, '100000000'), new TokenAmount(weth, '1000000000000000000')),
					new Pair(new TokenAmount(want, '100000000'), new TokenAmount(weth, '1000000000000000000')),
				],
				btc,
			);
			setRoute(newRoute);
			const trade = new Trade(newRoute, new TokenAmount(want, '100000000'), TradeType.EXACT_INPUT);
			console.log('trade:', trade);
		}
	};

	const handleToAmount = async (amount: string) => {
		setToAmount(amount);
		// TODO: Subtract fees from toAmount, convert to BTC and populate fromAmount
		const token = tokenMap ? tokenMap[selectedCoin.toLowerCase()] : null;
		if (token) {
			const value = token.valueIn(new BigNumber(amount), undefined, undefined, 8);
			value && parseFloat(value) > 0 ? setFromAmount(value) : setFromAmount('0');
		}
	};

	const handleFromAmount = async (amount: string) => {
		setFromAmount(amount);
		const token = tokenMap ? tokenMap[selectedCoin.toLowerCase()] : null;
		if (token) {
			// TODO: add in fees here - investigate using sushiswap SDK to get correct estimated amount
			const value = token.valueOut(new BigNumber(amount), undefined, undefined, 4);
			value && parseFloat(value) > 0 ? setToAmount(value) : setToAmount('0');
		}
	};

	return (
		<Container className={classes.mainContainer}>
			<Grid item className={classes.swapContainer}>
				<Grid item xs={12} sm={8}>
					<Paper className={classes.infoPaper}>
						<SwapFrom amount={fromAmount} handleFromAmount={handleFromAmount} />
						<SwapTo onTokenChange={handleSelectedCoin} amount={toAmount} handleToAmount={handleToAmount} />
						<PaymentButton />
						<FeeDisplay selectedCoin={selectedCoin} amount={fromAmount} />
					</Paper>
				</Grid>
			</Grid>
			<StatsDisplay />
		</Container>
	);
});
