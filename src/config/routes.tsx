import React from 'react';

import { Route } from 'mobx-router';
import type { Store } from '../stores/Store';
import { Swap } from '../components/swap';

const routes = {
	home: new Route<Store>({
		path: '/',
		component: <Swap />,
	}),
	earn: new Route<Store>({
		path: '/earn',
		component: <> </>,
	}),
};

export default routes;
