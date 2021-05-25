import { Container, Grid, Paper } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { DRAWER_WIDTH } from '../../config/constants/ui';
import { navHeight } from '../common/Navbar/Navbar';
import { Theme, makeStyles } from '@material-ui/core/styles';
import SwapTo from './SwapTo';
import SwapFrom from './SwapFrom';
import { StoreContext } from '../../stores/ZeroStore';
import { observer } from 'mobx-react-lite';
import { FeeDisplay } from './FeeDisplay';
import { SUPPORTED_TOKEN_NAMES } from '../../config/constants/tokens';
import PaymentButton from './PaymentButton';
import StatsDisplay from './StatsDisplay';

const useStyles = makeStyles((theme: Theme) => ({
	mainContainer: {
		[theme.breakpoints.up('md')]: {
			paddingLeft: DRAWER_WIDTH + 48,
		},
		paddingTop: `${navHeight + 1.5}rem`,
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
	} = store;

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

	const handleSelectedCoin = (name: SUPPORTED_TOKEN_NAMES) => {
		setSelectedCoin(name);
	};

	const [selectedCoin, setSelectedCoin] = useState(SUPPORTED_TOKEN_NAMES.USDC);

	return (
		<Container className={classes.mainContainer}>
			<Grid item className={classes.swapContainer}>
				<Grid item xs={12} sm={8} md={6}>
					<Paper className={classes.infoPaper}>
						<SwapFrom />
						<SwapTo onChange={handleSelectedCoin} />
						<PaymentButton />
						<FeeDisplay selectedCoin={selectedCoin} />
					</Paper>
				</Grid>
			</Grid>
			<StatsDisplay />
		</Container>
	);
});
