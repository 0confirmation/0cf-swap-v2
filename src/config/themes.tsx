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
		button: {
			textTransform: 'none',
		},
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
			paper: 'rgba(22, 21, 34, 1)',
			default: 'rgb(13, 4, 21)',
		},
		//@ts-ignore
		custom: {
			raisedPaper: 'rgba(32, 34, 49, 1) !important',
		},
	},
});
