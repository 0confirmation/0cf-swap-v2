import React from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';
import SwapToSelection from './SwapToSelection';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { SUPPORTED_TOKEN_NAMES } from '../../config/constants/tokens';
import { coerceInputToNumber } from '../../utils/helpers';

export interface SwapToProps {
	onTokenChange: (name: SUPPORTED_TOKEN_NAMES) => void;
	amount: string;
	handleToAmount: (amount: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
	inputContainer: {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(2),
		// Reason: typescript doesn't allow for custom classes on material-ui
		// @ts-ignore
		backgroundColor: theme.palette.custom.raisedPaper,
		borderRadius: '.625rem',
	},
	inputDecorationText: {
		fontWeight: 'bold',
		color: theme.palette.text.primary,
	},
	inputText: {
		fontSize: '1.5rem',
		[theme.breakpoints.down('xs')]: {
			fontSize: '1rem',
			marginTop: 'auto',
		},
	},
}));

const SwapTo = (props: SwapToProps) => {
	const classes = useStyles();
	const { onTokenChange, amount, handleToAmount } = props;

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		handleToAmount(coerceInputToNumber(event.target.value as string, amount));
	};

	return (
		<Grid container className={classes.inputContainer} direction="column">
			<Grid item xs={2}>
				<Typography variant="caption" className={classes.inputDecorationText}>
					TO
				</Typography>
			</Grid>
			<Grid container direction="row" justifyContent="space-between" alignItems="flex-end">
				<Grid item xs={5}>
					<SwapToSelection onTokenChange={onTokenChange} />
				</Grid>
				<Grid item xs={5}>
					<TextField
						value={amount}
						onChange={handleChange}
						InputProps={{
							classes: {
								input: classes.inputText,
							},
						}}
					/>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default SwapTo;
