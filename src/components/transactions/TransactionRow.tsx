import React from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Typography } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';

export interface TransactionRowProps {
	date: string;
	address: string;
	confirmations: string;
	status: string;
}

const useStyles = makeStyles((theme: Theme) => ({
	txRow: {
		textAlign: 'center',
		backgroundColor: '#2B2C3A',
		borderRadius: '8px',
		paddingTop: '4px',
		paddingBottom: '4px',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		cursor: 'pointer',
	},
}));

export const TransactionRow = observer((props: TransactionRowProps) => {
	const classes = useStyles();
	const { date, address, confirmations, status } = props;
	return (
		<Grid container direction="row" className={classes.txRow} onClick={() => alert('clicked!')}>
			<Grid item xs={3}>
				<Typography>{date}</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography>{address}</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography>{confirmations}</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography>{status}</Typography>
			</Grid>
		</Grid>
	);
});

export default TransactionRow;
