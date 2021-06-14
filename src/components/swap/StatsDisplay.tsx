import React, { useContext } from 'react';
import { Grid, Paper, Typography, Divider } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../stores/Store';
import { PriceHistory } from '../../config/models/currency';

const useStyles = makeStyles((theme: Theme) => ({
	statsPaper: {
		padding: theme.spacing(1, 3, 3, 3),
		marginBottom: theme.spacing(3),
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
}));

export const StatsDisplay = observer(() => {
	const classes = useStyles();
	const store = useContext(StoreContext);
	const {
		currency: { btcConfirmationTime, btcPriceHistory },
	} = store;

	const _getPercentDifference = (priceHistory: PriceHistory | undefined): string => {
		return priceHistory
			? priceHistory.currentPrice
					.minus(priceHistory.oldPrice)
					.dividedBy(priceHistory.oldPrice)
					.multipliedBy(1e2)
					.toFixed(2)
					.toString()
			: '-';
	};

	const _getValueDifference = (priceHistory: PriceHistory | undefined): string => {
		const prefix = priceHistory?.currentPrice.minus(priceHistory.oldPrice).gt(0) ? '$' : '$-';
		return priceHistory
			? prefix.concat(
					priceHistory.currentPrice.minus(priceHistory.oldPrice).absoluteValue().toFixed(2).toString(),
			  )
			: '-';
	};

	return (
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
					<Typography className={classes.statDescription}>Time For 6 Confirmations</Typography>
				</Grid>
				<Grid item xs={6}>
					<Grid container direction="row" justify="space-between" className={classes.statInfoRow}>
						<Grid item xs={4}>
							<Typography className={classes.statText}>{btcConfirmationTime} minutes</Typography>
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
							<Typography className={classes.statText}>
								{_getPercentDifference(btcPriceHistory)}%
							</Typography>
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
					<Typography className={classes.statDescription}>BTC Price Difference</Typography>
					<Typography className={classes.subDescription}>(vs. ~{btcConfirmationTime} mins ago)</Typography>
				</Grid>
				<Grid item xs={6}>
					<Grid container direction="row" justify="space-between" className={classes.statInfoRow}>
						<Grid item xs={4}>
							<Typography className={classes.statText}>{_getValueDifference(btcPriceHistory)}</Typography>
						</Grid>
						<Divider orientation="vertical" flexItem />
						<Grid item xs={4}>
							<Typography className={classes.statText}>$0.00</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	);
});

export default StatsDisplay;
