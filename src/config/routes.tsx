import React from 'react';

import { Route } from 'mobx-router';
import type { ZeroStore } from '../stores/ZeroStore';
import { Swap } from '../components/swap';

const routes = {
	home: new Route<ZeroStore>({
		path: '/',
		component: <Swap />,
	}),
	earn: new Route<ZeroStore>({
		path: '/earn',
		component: <> </>,
	}),
};

export default routes;
