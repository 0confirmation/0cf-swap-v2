import React from 'react';
import { Modal, Typography, Paper, Grid, Backdrop, Fade, Button } from '@material-ui/core';
import { observer } from 'mobx-react-lite';

export interface TransactionDetailsProps {}

export const TransactionDetails = observer((props: TransactionDetailsProps) => {
	// const classes = useStyles();

	return null;
	// <Modal
	// 	className={classes.modal}
	// 	open={open ?? false}
	// 	onClose={handleClose}
	// 	closeAfterTransition
	// 	BackdropComponent={Backdrop}
	// 	BackdropProps={{
	// 		timeout: 500,
	// 	}}
	// >
	// 	<Fade in={open}>
	// 		<Paper className={classes.paper}>
	// 			<div className={classes.paymentHeaderContainer}>
	// 				<Typography variant="h5" className={classes.paymentHeader}>
	// 					Transaction Details
	// 				</Typography>
	// 			</div>
	// 			<Grid container direction="row" justify="space-between">
	// 				<Grid item xs={12} md={8}>
	// 					<Grid
	// 						container
	// 						direction="column"
	// 						justify="center"
	// 						className={classes.paymentInfoContainer}
	// 					>
	// 						<Paper variant="outlined" className={classes.paymentInfoPaper}>
	// 						</Paper>
	// 					</Grid>
	// 				</Grid>
	// 			</Grid>
	// 			<Grid container justify="center">
	// 				<Button variant="outlined" className={classes.paymentIndicator}>
	// 					AWAITING PAYMENT
	// 				</Button>
	// 			</Grid>
	// 		</Paper>
	// 	</Fade>
	// </Modal>
});

export default TransactionDetails;
