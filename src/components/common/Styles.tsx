import { styled } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';
import { DRAWER_WIDTH } from '../../config/constants/ui';
import { navHeight } from '../common/Navbar/Navbar';

export const MainContainer = styled(Container)(({ theme }) => ({
	// Reason: typescript doesn't allow for custom classes on material-ui
	// @ts-ignore
	background: `radial-gradient(circle at 50%, ${theme.palette.custom.backgroundCircle}, ${theme.palette.background.default} 50%)`,
	[theme.breakpoints.up('md')]: {
		paddingLeft: DRAWER_WIDTH + 48,
		// @ts-ignore
		background: `radial-gradient(circle at 60%, ${theme.palette.custom.backgroundCircle}, ${theme.palette.background.default} 50%)`,
	},
	paddingTop: `${navHeight + 1.5}rem`,
	[theme.breakpoints.down('sm')]: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		paddingLeft: 0,
		paddingRight: 0,
	},
	height: '100%',
}));

export const PaperContainer = styled(Grid)(({ theme }) => ({
	paddingBottom: theme.spacing(6),
	justifyContent: 'center',
	display: 'flex',
}));
