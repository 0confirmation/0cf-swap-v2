import { createStyles, ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core';
import type { Route } from 'mobx-router';
import React, { useContext } from 'react';
import { StoreContext, ZeroStore } from '../../../stores/ZeroStore';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		listButton: {
			'&:hover': {
				'& $listItemText': {
					textDecoration: 'underline',
					textDecorationColor: theme.palette.secondary.main,
					textDecorationThickness: '3px',
				},
			},
		},
		listItemText: {
			color: theme.palette.text.primary,
			fontWeight: 'bold',
		},
	}),
);

interface SidebarListItemProps {
	title: string;
	view: Route<ZeroStore> | undefined;
	url: string | undefined;
}

export const SidebarListItem = (props: SidebarListItemProps): JSX.Element => {
	const classes = useStyles();
	const { title, view, url } = props;
	const store = useContext(StoreContext);
	const { goTo } = store.router;
	const { collapsedHeader, toggleSidebar } = store.ui;

	const handleRoute = (
		path: Route<ZeroStore, any, any> | undefined,
		url: string | undefined,
	): Promise<void> | void => {
		if (!collapsedHeader) toggleSidebar();
		if (path) {
			return goTo(path);
		} else {
			window.open(url);
			return;
		}
	};

	return (
		<ListItem
			button
			className={classes.listButton}
			key={title}
			onClick={() => {
				// We only want the sidebar to close if
				handleRoute(view, url);
			}}
		>
			<ListItemText key={title} className={classes.listItemText} primary={title} disableTypography />
		</ListItem>
	);
};

export default SidebarListItem;
