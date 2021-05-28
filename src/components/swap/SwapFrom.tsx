import React from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import btcIcon from '@iconify/icons-cryptocurrency/btc';
import { coerceInputToNumber } from '../../utils/helpers';

export interface SwapToProps {
	amount: string;
	handleFromAmount: (amount: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
	inputContainer: {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
		marginTop: theme.spacing(1.5),
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
	inputHeaderText: {
		color: theme.palette.text.primary,
		fontWeight: 'bolder',
		fontSize: '1.5rem',
		[theme.breakpoints.down('xs')]: {
			fontSize: '1rem',
			marginTop: 'auto',
		},
	},
	inputIcon: {
		paddingRight: theme.spacing(1),
		color: theme.palette.text.primary,
		fontSize: '32px',
		[theme.breakpoints.down('xs')]: {
			fontSize: '28px',
			marginTop: 'auto',
		},
	},
}));

const SwapTo = (props: SwapToProps) => {
	const classes = useStyles();
	const { amount, handleFromAmount } = props;

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		handleFromAmount(coerceInputToNumber(event.target.value as string, amount));
	};

	return (
		<Grid container className={classes.inputContainer} justify="flex-end" direction="column">
			<Typography variant="caption" className={classes.inputDecorationText}>
				FROM
			</Typography>
			<Grid container direction="row" justify="space-between">
				<Grid item xs={5}>
					<Grid container direction="row">
						<Icon icon={btcIcon} className={classes.inputIcon} />
						<Typography className={classes.inputHeaderText}>BTC</Typography>
					</Grid>
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
