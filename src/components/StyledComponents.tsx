import { withStyles, Paper, Theme } from '@material-ui/core';

export const PaperBorder = withStyles((theme: Theme) => ({
	root: {
		background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
		paddingTop: theme.spacing(0.3),
		paddingLeft: theme.spacing(0.2),
		paddingRight: theme.spacing(0.2),
		paddingBottom: theme.spacing(0.3),
	},
}))(Paper);
