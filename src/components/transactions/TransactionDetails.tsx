import React from 'react';
import { Modal, Typography, Paper, Grid, Backdrop, Fade } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { TransactionRowProps } from './TransactionRow';
import TransactionDetailsPaper from './TransactionDetailsPaper';
import TransactionStatusRow from './TransactionStatusRow';
import { PaperBorder } from '../StyledComponents';

export interface TransactionDetailsProps extends TransactionRowProps {
	handleClose?: () => void;
	open: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		overflowY: 'auto',
	},
	border: {
		width: '50%',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
	},
	transactionDetailsPaper: {
		textAlign: 'center',
		paddingTop: theme.spacing(2),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
		paddingBottom: theme.spacing(2),
		[theme.breakpoints.down('sm')]: {
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1),
		},
	},
	inputIcon: {
		paddingRight: theme.spacing(1),
		color: theme.palette.text.primary,
		fontSize: '48px',
		marginBottom: '4px',
		paddingTop: theme.spacing(1),

		[theme.breakpoints.down('sm')]: {
			fontSize: '36px',
		},
	},
	transactionPaper: {
		textAlign: 'center',
		padding: theme.spacing(2),
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	transactionText: {
		[theme.breakpoints.down('sm')]: {
			fontSize: '12px',
		},
	},
	statusText: {
		[theme.breakpoints.down('sm')]: {
			fontSize: '14px',
		},
	},
}));

export const TransactionDetails = observer((props: TransactionDetailsProps) => {
	const classes = useStyles();
	const { handleClose, open } = props;

	return (
		<Modal
			className={classes.modal}
			open={open ?? false}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={open}>
				<PaperBorder className={classes.border}>
					<Paper className={classes.transactionDetailsPaper}>
						<Typography variant="h5">Transaction Details</Typography>
						<Grid container direction="row" justify="space-between">
							<Grid item xs={6} md={5}>
								<TransactionDetailsPaper />
							</Grid>
							<Grid item xs={6} md={5}>
								<TransactionDetailsPaper />
							</Grid>
						</Grid>
						<Grid container direction="column" justify="center">
							<Grid container direction="row" justify="center">
								<TransactionStatusRow complete={true} statusText="Initializing Transaction Found" />
							</Grid>
							<Grid container direction="row" justify="center">
								<TransactionStatusRow complete={true} statusText="Liquidity Request Created" />
							</Grid>
							<Grid container direction="row" justify="center">
								<TransactionStatusRow complete={true} statusText="Liquidity Request Found By Keeper" />
							</Grid>
							<Grid container direction="row" justify="center">
								<TransactionStatusRow complete={false} statusText="Swap Complete" />
							</Grid>
							<Grid container direction="row" justify="center">
								<TransactionStatusRow complete={false} statusText="Funds Released" />
							</Grid>
						</Grid>
					</Paper>
				</PaperBorder>
			</Fade>
		</Modal>
	);
});

export default TransactionDetails;
