import React from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Typography } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';

export interface FeeRowProps {
	title: string;
	description: string;
	secondaryDescription?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
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

export const FeeRow = observer((props: FeeRowProps) => {
	const classes = useStyles();
	const { title, description, secondaryDescription } = props;

	return (
		<Grid container direction="row" className={classes.feeRow}>
			<Grid item xs={4} className={classes.feeInfoLeft}>
				{title}
			</Grid>
			<Grid item xs={8} className={classes.feeInfoRight}>
				<Typography className={classes.feeInfoTextHeader}>{description}</Typography>
				{secondaryDescription ? (
					<Typography variant="caption" color="textSecondary">
						{secondaryDescription}
					</Typography>
				) : null}
			</Grid>
		</Grid>
	);
});

export default FeeRow;
