import React, { useEffect, useContext, useState } from 'react';
import { StoreContext } from '../../stores/Store';
import { Modal, Typography, Paper, Grid, Backdrop, Fade, Button } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { PaymentModalProps } from '../swap/PaymentButton';
import { PaperBorder } from '../StyledComponents';
import QRCode from '../qrScanner/index';
import { constants } from 'ethers';
import { TransferRequest, createZeroConnection, createZeroKeeper, createZeroUser } from 'zero-protocol';
import { LIB_P2P_URI } from '../../config/constants/zero';

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
	 * XXTODO: Update to use correct values
	 */
	const transferRequest = new TransferRequest(
		constants.AddressZero,
		constants.AddressZero,
		constants.AddressZero,
		constants.AddressZero,
		fromAmount,
		'0x00',
	);

	useEffect(() => {
		async function createTransferRequest() {
			const zeroConnectionOne = await createZeroConnection(LIB_P2P_URI);
			const zeroConnectionTwo = await createZeroConnection(LIB_P2P_URI);
			const zeroUser = createZeroUser(zeroConnectionOne);
			const zeroKeeper = createZeroKeeper(zeroConnectionTwo);

			await zeroKeeper.advertiseAsKeeper(connectedAddress);
			await zeroUser.subscribeKeepers();

			/* Sign transaction */
			// const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner(0);
			// await transferRequest.sign(signer);

			await zeroUser.publishTransferRequest(transferRequest);

			/*
			 * Once keeper dials back, compute deposit address and
			 * display it
			 */
			const gatewayAddressInput = {
				destination: connectedAddress,
				mpkh: constants.AddressZero, //XXTODO: Get correct value
				isTest: true,
			};

			const getGatewayAddress = transferRequest.toGatewayAddress(gatewayAddressInput);
			setGatewayAddress(getGatewayAddress);
		}

		createTransferRequest();
	});

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
						<Grid container direction="row" justify="space-between">
							<Grid item xs={12} md={3} className={classes.qrCode}>
								{/* TODO: Generate QR based on address from renVM */}
								<QRCode
									// data={parcel && parcel.depositAddress}
									data={gatewayAddress}
									size={110}
									framed={false}
								/>
							</Grid>
							<Grid item xs={12} md={8}>
								<Grid
									container
									direction="column"
									justify="center"
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
						<Grid container justify="center">
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
