import React, { useContext } from 'react';
import { Modal, Typography, Paper, Grid, Backdrop, Fade } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { TransactionRowProps } from './TransactionRow';
import TransactionDetailsPaper from './TransactionDetailsPaper';
import TransactionStatusRow from './TransactionStatusRow';
import { PaperBorder } from '../StyledComponents';
import { IconifyIcon } from '@iconify/react';
import btcIcon from '@iconify/icons-cryptocurrency/btc';
import usdcIcon from '@iconify/icons-cryptocurrency/usdc';
import { StoreContext } from '../../stores/Store';
import { shortenAddress } from '../../utils/helpers';

export interface TransactionDetailsProps extends TransactionRowProps {
	handleClose?: () => void;
	open: boolean;
}

interface TransactionDetailsBaseProps {
	type: string;
	amount: string;
	transaction: string;
	transactionBlock: string;
	icon: IconifyIcon;
	currency: string;
}
export interface TransactionDetailsFromProps extends TransactionDetailsBaseProps {
	nativeAddress: string;
	fees: string;
}

export interface TransactionDetailsToProps extends TransactionDetailsBaseProps {
	escrowAddress: string;
	finalAddress: string;
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
	const { handleClose, open, status, address, confirmations } = props;
	const store = useContext(StoreContext);
	const {
		wallet: { connectedAddress },
	} = store;

	const toProps: TransactionDetailsToProps = {
		type: 'to',
		amount: '33,000',
		transaction: '...',
		transactionBlock: confirmations,
		icon: usdcIcon as any as IconifyIcon,
		currency: 'USDC',
		escrowAddress: address,
		finalAddress: shortenAddress(connectedAddress),
	};

	const fromProps: TransactionDetailsFromProps = {
		type: 'from',
		amount: '1.0',
		transaction: '...',
		transactionBlock: '1/6',
		icon: btcIcon as any as IconifyIcon,
		currency: 'BTC',
		fees: '0.001',
		nativeAddress: '3BPPU3...eiWPQ',
	};

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
								<TransactionDetailsPaper {...fromProps} />
							</Grid>
							<Grid item xs={6} md={5}>
								<TransactionDetailsPaper {...toProps} />
							</Grid>
						</Grid>
						<Grid container direction="column" justify="center">
							<Grid container direction="row" justify="center">
								<TransactionStatusRow
									complete={status >= 0}
									statusText="Initializing Transaction Found"
								/>
							</Grid>
							<Grid container direction="row" justify="center">
								<TransactionStatusRow complete={status >= 1} statusText="Liquidity Request Created" />
							</Grid>
							<Grid container direction="row" justify="center">
								<TransactionStatusRow
									complete={status >= 2}
									statusText="Liquidity Request Found By Keeper"
								/>
							</Grid>
							<Grid container direction="row" justify="center">
								<TransactionStatusRow complete={status >= 3} statusText="Swap Complete" />
							</Grid>
							<Grid container direction="row" justify="center">
								<TransactionStatusRow complete={status >= 4} statusText="Funds Released" />
							</Grid>
						</Grid>
					</Paper>
				</PaperBorder>
			</Fade>
		</Modal>
	);
});

export default TransactionDetails;
