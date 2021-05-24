import React from 'react';
import type { IconifyIcon } from '@iconify/react';
import { Icon } from '@iconify/react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
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

export interface SwapDisplayProps {
	icon: IconifyIcon;
	name: string;
}

export const SwapDisplay = (displayProps: SwapDisplayProps): JSX.Element => {
	const classes = useStyles();

	return (
		<Grid container direction="row">
			<Icon icon={displayProps.icon} className={classes.inputIcon} />
			<Typography className={classes.inputHeaderText}>{displayProps.name}</Typography>
		</Grid>
	);
};
