import React, { useContext } from 'react';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import Header from './Header';
import MobileHeader from './MobileHeader';
import { StoreContext } from '../../../stores/Store';
import { observer } from 'mobx-react-lite';

export const navHeight = 4;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			backgroundColor: theme.palette.background.paper,
			boxShadow: 'none',
			background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%) left bottom no-repeat`,
			backgroundSize: '100% 2px , 100% auto',
			height: `${navHeight}rem`,
		},
		navBarWrapper: {
			display: 'flex',
			justifyContent: 'space-between',
			width: '100%',
		},
	}),
);

export const Navbar = observer(() => {
	const classes = useStyles();
	const store = useContext(StoreContext);
	const collapsedHeader = store.ui.collapsedHeader;

	return (
		<AppBar position="fixed" className={classes.appBar}>
			<Toolbar className={classes.navBarWrapper}>{collapsedHeader ? <Header /> : <MobileHeader />}</Toolbar>
		</AppBar>
	);
});

export default Navbar;
