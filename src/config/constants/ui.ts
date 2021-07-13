export const COLLAPSE_WIDTH = 960;
export const DRAWER_WIDTH = 240;

export enum BUTTON_STATUS {
	disconnected = 'Connect Wallet',
	noKeeper = 'Awaiting Keeper',
	keeperConnected = 'Review Order',
}

export enum TRANSACTION_STATUS {
	'Transaction Found',
	'Request Created',
	'Keeper Assigned',
	'Swap Complete',
	'Complete',
}
