import React from 'react';
import { Modal, Typography, Paper, Grid, Backdrop, Fade, Button } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';

export interface PaymentModalProps {
	open: boolean;
	handleClose: () => void;
}

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
		textAlign: 'center',
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
	const classes = useStyles();
	const { open, handleClose } = props;
	return (
		<Modal
			className={classes.modal}
			open={open}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={open}>
				<Paper className={classes.paper}>
					<div className={classes.paymentHeaderContainer}>
						<Typography variant="h5" className={classes.paymentHeader}>
							Bitcoin Payment
						</Typography>
						<Typography>
							You are selling <b>0.03</b> BTC for at least <b>1,183.30 USDC</b>
						</Typography>
						<Typography variant="body2" className={classes.additionalInfo}>
							Expected Price Slippage: <b>0.61%</b>
						</Typography>
					</div>
					<Grid container direction="row" justify="space-between">
						<Grid item xs={12} md={3} className={classes.qrCode}>
							<img src={'/assets/images/qr.png'} alt="Bitcoin Address QR" />
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
											To complete payment, send 0.03 BTC to the below address
										</Typography>
										<Typography variant="caption" color="secondary">
											3FNraEC1yo8xE8bnRzEim1vwgmpLeEdNPN
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
			</Fade>
		</Modal>
	);
});

export default PaymentModal;
