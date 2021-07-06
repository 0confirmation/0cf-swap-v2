import React from 'react';
import { Typography, Paper, Grid } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { Icon } from '@iconify/react';
import btcIcon from '@iconify/icons-cryptocurrency/btc';

export interface TransactionDetailsPaperProps {
	amount: string;
	nativeAddress?: string;
	escrowAddress?: string;
	finalAddress?: string;
	fees?: string;
	nativeTransaction?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
	inputIcon: {
		marginTop: 'auto',
		marginBottom: 'auto',
		paddingRight: theme.spacing(1),
		color: theme.palette.text.primary,
		fontSize: '40px',
		[theme.breakpoints.down('xs')]: {
			fontSize: '36px',
			paddingTop: theme.spacing(1),
		},
	},
	transactionPaper: {
		textAlign: 'center',
		padding: theme.spacing(2),
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		marginLeft: theme.spacing(0.5),
		marginRight: theme.spacing(0.5),
	},
	transactionText: {
		[theme.breakpoints.down('xs')]: {
			fontSize: '12px',
		},
	},
	currencyHeaderText: {
		fontWeight: 'bold',
		fontSize: '36px',
	},
	transactionHeader: {
		textAlign: 'left',
		paddingBottom: theme.spacing(1),
	},
}));

export const TransactionDetailsPaper = observer((props) => {
	const classes = useStyles();

	return (
		<Paper variant="outlined" className={classes.transactionPaper}>
			<Grid container direction="column" justify="flex-start" className={classes.transactionHeader}>
				<Typography className={classes.transactionText}>FROM</Typography>
				<Grid container direction="row">
					<Icon icon={btcIcon} className={classes.inputIcon} />
					<Typography className={classes.currencyHeaderText}>BTC</Typography>
				</Grid>
			</Grid>

			<Grid container direction="row" justify="space-between">
				<Typography className={classes.transactionText}>Amount:</Typography>
				<Typography className={classes.transactionText}>1.0</Typography>
			</Grid>
			<Grid container direction="row" justify="space-between">
				<Typography className={classes.transactionText}>To:</Typography>
				<Typography className={classes.transactionText}>3BPPU3...eiWPQ</Typography>
			</Grid>
			<Grid container direction="row" justify="space-between">
				<Typography className={classes.transactionText}>Fees:</Typography>
				<Typography className={classes.transactionText}>.001 BTC</Typography>
			</Grid>
			<Grid container direction="row" justify="space-between">
				<Typography className={classes.transactionText}>Transaction:</Typography>
				<Typography className={classes.transactionText}>...</Typography>
			</Grid>
			<Grid container direction="row" justify="space-between">
				<Typography className={classes.transactionText}>Confirmations:</Typography>
				<Typography className={classes.transactionText}>1/6</Typography>
			</Grid>
		</Paper>
	);
});

export default TransactionDetailsPaper;
