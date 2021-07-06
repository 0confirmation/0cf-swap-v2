import React from 'react';

import { Route } from 'mobx-router';
import type { Store as RootStore } from '../stores/Store';
import { Swap } from '../components/swap';
import { TransactionList } from '../components/transactions/TransactionList';

const routes = {
	home: new Route<RootStore>({
		path: '/',
		component: <Swap />,
	}),
	transactions: new Route<RootStore>({
		path: '/transactions',
		component: <TransactionList />,
	}),
	earn: new Route<RootStore>({
		path: '/earn',
		component: <> </>,
	}),
};

export default routes;
