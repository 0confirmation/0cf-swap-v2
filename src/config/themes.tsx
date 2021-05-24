import { createMuiTheme } from '@material-ui/core';

const fontFamily = [
	'IBM Plex Sans',
	'Arial',
	'sans-serif',
	'"Apple Color Emoji"',
	'"Segoe UI Emoji"',
	'"Segoe UI Symbol"',
].join(',');

export const sushiTheme = createMuiTheme({
	typography: {
		fontFamily: fontFamily,
	},
	shape: {
		borderRadius: 15,
	},
	palette: {
		type: 'dark',
		primary: {
			main: '#2F82B1',
		},
		secondary: {
			main: '#FA52A0',
		},
		text: {
			primary: '#FFFFFF',
		},
		background: {
			paper: '#191932',
			default: '#0D0E20',
		},
	},
});
