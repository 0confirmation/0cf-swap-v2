import React from 'react';
import { observer } from 'mobx-react-lite';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

export interface TransactionDetailsPaperRowProps {
	description: string;
	content: string;
}

const useStyles = makeStyles((theme: Theme) => ({
	transactionText: {
		[theme.breakpoints.down('xs')]: {
			fontSize: '12px',
		},
	},
}));

const TransactionDetailsPaperRow = observer((props: TransactionDetailsPaperRowProps) => {
	const classes = useStyles();

	const { content, description } = props;

	return (
		<Grid container direction="row" justify="space-between">
			<Typography className={classes.transactionText}>{description}</Typography>
			<Typography className={classes.transactionText}>{content}</Typography>
		</Grid>
	);
});

export default TransactionDetailsPaperRow;
