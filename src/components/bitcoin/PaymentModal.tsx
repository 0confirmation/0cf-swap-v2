import React, { useEffect, useContext, useState } from 'react';
import { StoreContext } from '../../stores/Store';
import { Modal, Typography, Paper, Grid, Backdrop, Fade, Button } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { PaymentModalProps } from '../swap/PaymentButton';
import { PaperBorder } from '../StyledComponents';
import QRCode from '../qrScanner/index';

const useStyles = makeStyles((theme: Theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		minWidth: '50%',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	paymentHeaderContainer: {
		textAlign: 'center',
	},
	paymentHeader: {
		paddingBottom: theme.spacing(2),
		fontWeight: 'bold',
	},
	additionalInfo: {
		paddingBottom: theme.spacing(3),
	},
	qrCode: {
		marginLeft: 'auto',
		marginRight: 'auto',
		display: 'flex',
		justifyContent: 'center',
		[theme.breakpoints.down('md')]: {
			paddingBottom: theme.spacing(2),
		},
	},
	paymentInfoContainer: {
		height: '100%',
	},
	paymentInfoPaper: {
		padding: theme.spacing(2, 3, 2, 3),
	},
	paymentIndicator: {
		textAlign: 'center',
		margin: theme.spacing(2, 0, 2, 0),
		pointerEvents: 'none',
	},
}));

export const PaymentModal = observer((props: PaymentModalProps): JSX.Element => {
	const store = useContext(StoreContext);
	const classes = useStyles();
	const { open, handleClose, fromAmount, toAmount, priceImpact, toCurrency, fromCurrency } = props;
	const [gatewayAddress, setGatewayAddress] = useState('');
	const connectedAddress = store.wallet.connectedAddress;

	/*
	 * Initiate TransferRequest object with required parameters
	 *
	 */
	useEffect(() => {
		async function getTransferRequest() {
			const transferRequest = await store.zero.createTransferRequest(connectedAddress, fromAmount, toCurrency);
			setGatewayAddress(transferRequest.gatewayAddress);
			const deposit: any = await new Promise((resolve) => transferRequest.on('deposit', resolve));

			const confirmed = await deposit.confirmed();
			confirmed.on('deposit', (currentConfirmations: string, totalNeeded: string) => {
				console.log(currentConfirmations + '/' + totalNeeded + ' confirmations seen');
			});

			const signed = await deposit.signed();
			signed.on('status', (status: string) => {
				if (status === 'signed') console.log('RenVM has produced signature');
			});
		}
		getTransferRequest();
	}, [connectedAddress, toCurrency, fromAmount]);

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
				<PaperBorder>
					<Paper className={classes.paper}>
						<div className={classes.paymentHeaderContainer}>
							<Typography variant="h5" className={classes.paymentHeader}>
								Bitcoin Payment
							</Typography>
							<Typography>
								You are selling <b>{fromAmount}</b> {fromCurrency} for approximately{' '}
								<b>
									{toAmount} {toCurrency}
								</b>
							</Typography>
							<Typography variant="body2" className={classes.additionalInfo}>
								Expected Price Impact: <b>{priceImpact}%</b>
							</Typography>
						</div>
						<Grid container direction="row" justifyContent="space-between">
							<Grid item xs={12} md={3} className={classes.qrCode}>
								<QRCode data={gatewayAddress} size={110} framed={false} />
							</Grid>
							<Grid item xs={12} md={8}>
								<Grid
									container
									direction="column"
									justifyContent="center"
									className={classes.paymentInfoContainer}
								>
									<Paper variant="outlined" className={classes.paymentInfoPaper}>
										<Grid container direction="column">
											<Typography variant="caption">
												To complete payment, send {fromAmount} {fromCurrency} to the below
												address
											</Typography>
											<Typography variant="caption" color="secondary">
												{gatewayAddress}
											</Typography>
										</Grid>
									</Paper>
								</Grid>
							</Grid>
						</Grid>
						<Grid container justifyContent="center">
							<Button variant="outlined" className={classes.paymentIndicator}>
								AWAITING PAYMENT
							</Button>
						</Grid>
					</Paper>
				</PaperBorder>
			</Fade>
		</Modal>
	);
});

export default PaymentModal;
