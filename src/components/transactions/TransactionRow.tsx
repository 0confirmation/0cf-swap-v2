import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Typography } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import TransactionDetails from './TransactionDetails';
import { TRANSACTION_STATUS } from '../../config/constants/ui';

export interface TransactionRowProps {
	date: string;
	address: string;
	confirmations: string;
	status: number;
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

	const [open, setOpen] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Grid container direction="row" className={classes.txRow} onClick={() => setOpen(true)}>
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
					<Typography>
						{Object.keys(TRANSACTION_STATUS).find((key) => TRANSACTION_STATUS[key] === status)}
					</Typography>
				</Grid>
			</Grid>
			<TransactionDetails {...props} open={open} handleClose={handleClose} />
		</>
	);
});

export default TransactionRow;
