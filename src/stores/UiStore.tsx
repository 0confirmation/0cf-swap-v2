import { action, extendObservable } from 'mobx';
import { COLLAPSE_WIDTH } from '../config/constants/ui';
import type { ZeroStore } from './ZeroStore';

export default class UiStore {
	private readonly store!: ZeroStore;

	public sidebarOpen!: boolean;
	public collapsedHeader: boolean;
	public darkMode: boolean;

	constructor(store: ZeroStore) {
		this.store = store;
		this.collapsedHeader = window.innerWidth >= COLLAPSE_WIDTH;
		this.darkMode = false;

		extendObservable(this, {
			sidebarOpen: !!window && window.innerWidth >= COLLAPSE_WIDTH,
			collapsedHeader: !!window && window.innerWidth >= COLLAPSE_WIDTH,
		});

		// Check if sidebar should be open or not
		window.onresize = () => {
			this.checkWindowSize();
		};
	}

	checkWindowSize = action((): void => {
		this.sidebarOpen = window.innerWidth >= COLLAPSE_WIDTH;
		this.collapsedHeader = window.innerWidth >= COLLAPSE_WIDTH;
	});

	toggleSidebar = action((): void => {
		this.sidebarOpen = !this.sidebarOpen;
	});
}
