import React from 'react';
import { Drawer, List, Toolbar, Grid } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { DRAWER_WIDTH } from '../../../config/constants/ui';
import { useContext } from 'react';
import { StoreContext } from '../../../stores/Store';
import { observer } from 'mobx-react-lite';
import { SidebarListItem } from './SidebarListItem';
import WalletButton from '../WalletButton';
import Logo from '../Logo';
import views from '../../../config/routes';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		drawer: {
			width: DRAWER_WIDTH,
			color: theme.palette.text.primary,
			zIndex: theme.zIndex.drawer,
		},
		drawerPaper: {
			width: DRAWER_WIDTH,
			backgroundColor: theme.palette.background.paper,
		},
		drawerContainer: {
			display: 'flex',
			backgroundColor: theme.palette.background.paper,
			flexDirection: 'column',
			justifyContent: 'space-between',
			height: '100%',
			overflowX: 'hidden',
			overflowY: 'auto',
		},
		listItemText: {
			color: theme.palette.text.primary,
		},
		footer: {
			cursor: 'pointer',
		},
		walletButton: {
			marginTop: '0.5rem',
			marginBottom: '1rem',
		},
	}),
);

const mainSidebarLinks = [
	{ title: 'Swap', view: views.home, url: undefined, disabled: false },
	{ title: 'Earn', view: views.earn, url: undefined, disabled: true },
	{ title: 'Transactions', view: views.transactions, url: undefined, disabled: false },
];

const secondarySidebarLinks = [
	{
		title: 'Sushiswap',
		view: undefined,
		url: 'https://sushi.com/',
		disabled: false,
	},
	{
		title: '0confirmation',
		view: undefined,
		url: 'https://0confirmation.com/',
		disabled: false,
	},
	{ title: 'Docs', view: undefined, url: 'https://docs.0confirmation.com/', disabled: false },
	//TODO: Make contact dropdown with socials links
	{ title: 'Contact', view: undefined, url: '_blank', disabled: true },
];

export const Sidebar = observer(() => {
	const classes = useStyles();
	const store = useContext(StoreContext);
	const { sidebarOpen, collapsedHeader, toggleSidebar } = store.ui;
	return (
		<Drawer
			className={classes.drawer}
			open={sidebarOpen}
			variant={collapsedHeader ? 'persistent' : 'temporary'}
			onClose={() => toggleSidebar()}
		>
			<Toolbar>
				<Grid container direction="column">
					<Logo />
					{collapsedHeader ? null : (
						<Grid className={classes.walletButton}>
							<WalletButton />
						</Grid>
					)}
				</Grid>
			</Toolbar>

			<div className={classes.drawerContainer}>
				<List>
					{mainSidebarLinks.map((linkInfo) => (
						<SidebarListItem
							key={linkInfo.title}
							title={linkInfo.title}
							view={linkInfo.view}
							url={linkInfo.url}
							disabled={linkInfo.disabled}
						/>
					))}
				</List>
				<List className={classes.footer}>
					{secondarySidebarLinks.map((linkInfo) => (
						<SidebarListItem
							key={linkInfo.title}
							title={linkInfo.title}
							view={linkInfo.view}
							url={linkInfo.url}
							disabled={linkInfo.disabled}
						/>
					))}
				</List>
			</div>
		</Drawer>
	);
});

export default Sidebar;
