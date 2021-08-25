import React from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		titleText: {
			color: theme.palette.text.primary,
			fontFamily: 'Permanent Marker',
			fontWeight: 'bold',
		},
		primarySubTitle: {
			color: theme.palette.text.primary,
			opacity: '0.7',
		},
		secondarySubtitle: {
			color: theme.palette.text.primary,
			marginLeft: '5px',
		},
		noMargin: {
			margin: '0',
			padding: '0',
		},
	}),
);

export default function WalletButton() {
	const classes = useStyles();
	return (
		<List>
			<ListItem className={classes.noMargin}>
				<Typography className={classes.titleText} variant="h6" noWrap>
					zeroSWAP
				</Typography>
			</ListItem>
			<ListItem className={classes.noMargin}>
				<Typography variant="body2" className={classes.primarySubTitle}>
					Powered By:
				</Typography>
				<Typography className={`${classes.secondarySubtitle}`} variant="body2">
					zeroDAO
				</Typography>
			</ListItem>
		</List>
	);
}
