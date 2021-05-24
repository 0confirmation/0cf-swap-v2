import React from 'react';
import { Button, Modal, Typography, Paper, Grid } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles((theme: Theme) => ({
	submitButton: {
		background: `linear-gradient(${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%) left bottom no-repeat`,
		color: theme.palette.text.primary,
		fontWeight: 'bold',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
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
	paymentAmount: {
		paddingBottom: theme.spacing(1),
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

export const BitcoinPayment = observer((): JSX.Element => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button className={classes.submitButton} onClick={handleOpen} variant="contained">
				REVIEW ORDER
			</Button>
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
		</>
	);
});
