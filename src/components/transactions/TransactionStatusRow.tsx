import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';

export interface TransactionStatusRowProps {
	complete: boolean;
	statusText: string;
}

const completeIcon = '/assets/images/complete.svg';
const incompleteIcon = '/assets/images/incomplete.svg';

const useStyles = makeStyles((theme: Theme) => ({
	statusText: {
		[theme.breakpoints.down('sm')]: {
			fontSize: '14px',
		},
	},
}));

const TransactionStatusRow = observer((props: TransactionStatusRowProps) => {
	const classes = useStyles();
	const { complete, statusText } = props;

	return (
		<Grid container direction="row" justify="center">
			<Grid item xs={2}>
				<img src={complete ? completeIcon : incompleteIcon} alt="" />
			</Grid>
			<Grid item xs={6}>
				<Typography className={classes.statusText}>{statusText}</Typography>
			</Grid>
		</Grid>
	);
});

export default TransactionStatusRow;
