import React from 'react';
import { Typography, Paper, Grid } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { Icon, IconifyIcon } from '@iconify/react';
import TransactionDetailsPaperRow from './TransactionDetailsPaperRow';

export interface TransactionDetailsPaperProps {
	type: string;
	amount: string;
	nativeAddress?: string;
	escrowAddress?: string;
	finalAddress?: string;
	fees?: string;
	transaction: string;
	transactionBlock: string;
	icon: IconifyIcon;
	currency: string;
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

export const TransactionDetailsPaper = observer((props: TransactionDetailsPaperProps) => {
	const classes = useStyles();

	const {
		type,
		amount,
		nativeAddress,
		escrowAddress,
		finalAddress,
		fees,
		transaction,
		transactionBlock,
		icon,
		currency,
	} = props;

	return (
		<Paper variant="outlined" className={classes.transactionPaper}>
			<Grid container direction="column" justify="flex-start" className={classes.transactionHeader}>
				<Typography className={classes.transactionText}>{type === 'to' ? 'TO' : 'FROM'}</Typography>
				<Grid container direction="row">
					<Icon icon={icon} className={classes.inputIcon} />
					<Typography className={classes.currencyHeaderText}>{currency}</Typography>
				</Grid>
			</Grid>

			<TransactionDetailsPaperRow description="Amount:" content={amount} />
			<TransactionDetailsPaperRow description="Transaction:" content={transaction} />
			{type === 'to' ? (
				<>
					<TransactionDetailsPaperRow description="Destination:" content={finalAddress ?? '...'} />
					<TransactionDetailsPaperRow description="Escrow:" content={escrowAddress ?? '...'} />
					<TransactionDetailsPaperRow description="Blocks Until Liquidation:" content={transactionBlock} />
				</>
			) : (
				<>
					<TransactionDetailsPaperRow description="To:" content={nativeAddress ?? '...'} />
					<TransactionDetailsPaperRow description="Fees:" content={fees ? `${fees} ${currency}` : '...'} />
					<TransactionDetailsPaperRow description="Confirmations" content={'1/6'} />
				</>
			)}
		</Paper>
	);
});

export default TransactionDetailsPaper;
