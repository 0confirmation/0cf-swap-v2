import { Container, Grid, Paper, Typography, Divider } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { DRAWER_WIDTH } from '../../config/constants/ui';
import { navHeight } from '../common/Navbar/Navbar';
import { Theme, makeStyles } from '@material-ui/core/styles';
import SwapTo from './SwapTo';
import SwapFrom from './SwapFrom';
import { StoreContext } from '../../stores/ZeroStore';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js';
import { BitcoinPayment } from '../bitcoin/BitcoinPayment';

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
	statsPaper: {
		padding: theme.spacing(1, 3, 3, 3),
		marginBottom: theme.spacing(3),
	},
	descriptionContainer: {
		paddingTop: theme.spacing(6),
	},
	statDivider: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	statHeader: {
		fontWeight: 'bold',
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		[theme.breakpoints.down('sm')]: {
			fontSize: '1.2rem',
		},
	},
	statDescriptionContainer: {
		marginTop: 'auto',
	},
	statDescription: {
		paddingTop: theme.spacing(2),
		paddingRight: theme.spacing(2),
		color: theme.palette.text.primary,
		fontWeight: 'bold',
	},
	subDescription: {
		color: theme.palette.text.primary,
		opacity: '0.5',
		fontSize: theme.typography.fontSize - 4,
		whiteSpace: 'nowrap',
	},
	statText: {
		paddingTop: theme.spacing(2),
		[theme.breakpoints.down('sm')]: {
			fontSize: theme.typography.fontSize - 1,
		},
	},
	statInfoRow: {
		height: '100%',
	},

	feePaper: {
		padding: theme.spacing(2),
		margin: theme.spacing(2),
	},
	feeRow: {
		padding: theme.spacing(0.5, 0, 0.5, 0),
	},
	feeInfoLeft: {
		fontWeight: 'bold',
		marginTop: 'auto',
		marginBottom: 'auto',
	},
	feeInfoRight: {
		textAlign: 'right',
	},
	feeInfoTextHeader: {
		marginBottom: '-5px',
	},
}));

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
		currency: { toToken },
		wallet: { zero },
	} = store;

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

	const [selectedCoin, setSelectedCoin] = useState('USD-Coin');

	const handleSelectedCoin = (name: string) => {
		setSelectedCoin(name);
	};

	return (
		<Container className={classes.mainContainer}>
			<Grid item className={classes.swapContainer}>
				<Grid item xs={12} sm={8} md={6}>
					<Paper className={classes.infoPaper}>
						<SwapFrom />
						<SwapTo onChange={handleSelectedCoin} />
						<Grid container justify="center">
							<BitcoinPayment />
						</Grid>
						<Paper variant="outlined" className={classes.feePaper}>
							<Grid container direction="row" className={classes.feeRow}>
								<Grid item xs={4} className={classes.feeInfoLeft}>
									Rate
								</Grid>
								<Grid item xs={8} className={classes.feeInfoRight}>
									<Typography>
										1 BTC = {toToken(new BigNumber(1), selectedCoin.toLowerCase(), 'bitcoin', 2)}{' '}
										{store.currency.tokenMap![selectedCoin.toLowerCase()].symbol}
									</Typography>
								</Grid>
							</Grid>
							<Grid container direction="row" className={classes.feeRow}>
								<Grid item xs={6} className={classes.feeInfoLeft}>
									Protocol Fees
								</Grid>
								<Grid item xs={6} className={classes.feeInfoRight}>
									<Typography className={classes.feeInfoTextHeader}>0.00042 BTC</Typography>
									<Typography variant="caption" color="textSecondary">
										($226.01)
									</Typography>
								</Grid>
							</Grid>
							<Grid container direction="row" className={classes.feeRow}>
								<Grid item xs={6} className={classes.feeInfoLeft}>
									Approx. Slippage
								</Grid>
								<Grid item xs={6} className={classes.feeInfoRight}>
									<Typography>0.01%</Typography>
								</Grid>
							</Grid>
							<Grid container direction="row" className={classes.feeRow}>
								<Grid item xs={6} className={classes.feeInfoLeft}>
									Estimated Gas Cost
								</Grid>
								<Grid item xs={6} className={classes.feeInfoRight}>
									<Typography className={classes.feeInfoTextHeader}>0.00001 BTC</Typography>
									<Typography variant="caption" color="textSecondary">
										($5.40)
									</Typography>
								</Grid>
							</Grid>
						</Paper>
					</Paper>
				</Grid>
			</Grid>

			{/* STATS COMPONENT */}
			<Paper className={classes.statsPaper}>
				<Grid container direction="row">
					<Grid item xs={6}></Grid>
					<Grid item xs={6}>
						<Grid container direction="row" justify="space-between" alignItems="flex-end">
							<Grid item xs={4}>
								<Typography variant="h6" className={classes.statHeader}>
									BTC
								</Typography>
							</Grid>
							<Grid item xs={4}>
								<Typography variant="h6" className={classes.statHeader}>
									Zero Swap
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid container direction="row">
					<Grid item xs={6} className={classes.statDescriptionContainer}>
						<Typography className={classes.statDescription}>Confirmation Time</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container direction="row" justify="space-between" className={classes.statInfoRow}>
							<Grid item xs={4}>
								<Typography className={classes.statText}>60 minutes</Typography>
							</Grid>
							<Divider orientation="vertical" flexItem />
							<Grid item xs={4}>
								<Typography className={classes.statText}>15 seconds</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid container direction="row">
					<Grid item xs={6} className={classes.statDescriptionContainer}>
						<Typography className={classes.statDescription}>Time Slippage</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container direction="row" justify="space-between" className={classes.statInfoRow}>
							<Grid item xs={4}>
								<Typography className={classes.statText}>-12%</Typography>
							</Grid>
							<Divider orientation="vertical" flexItem />
							<Grid item xs={4}>
								<Typography className={classes.statText}>0%</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid container direction="row">
					<Grid item xs={6} className={classes.statDescriptionContainer}>
						<Typography className={classes.statDescription}>Value Difference</Typography>
						<Typography className={classes.subDescription}>(vs. 60 mins ago)</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container direction="row" justify="space-between" className={classes.statInfoRow}>
							<Grid item xs={4}>
								<Typography className={classes.statText}>-$12,000.00</Typography>
							</Grid>
							<Divider orientation="vertical" flexItem />
							<Grid item xs={4}>
								<Typography className={classes.statText}>$0.00</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
});
