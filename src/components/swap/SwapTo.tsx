import React from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';
import SwapToSelection from './SwapToSelection';
import { Theme, makeStyles } from '@material-ui/core/styles';

export interface SwapToProps {
	onChange: (name: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
	inputContainer: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	},
	inputDecorationText: {
		fontWeight: 'bold',
		color: theme.palette.text.primary,
	},
	inputText: {
		fontSize: '1.65rem',
	},
}));

const SwapTo = (props: SwapToProps) => {
	const classes = useStyles();
	const { onChange } = props;

	return (
		<Grid container className={classes.inputContainer} direction="column">
			<Grid item xs={2}>
				<Typography variant="caption" className={classes.inputDecorationText}>
					TO
				</Typography>
			</Grid>
			<Grid container direction="row" justify="space-between">
				<Grid item xs={5}>
					<SwapToSelection onChange={onChange} />
				</Grid>
				<Grid item xs={5}>
					<TextField
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
