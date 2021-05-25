import React from 'react';
import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import BitcoinPayment from '../bitcoin/BitcoinPayment';

export const PaymentButton = observer(() => {
	return (
		<Grid container justify="center">
			<BitcoinPayment />
		</Grid>
	);
});

export default PaymentButton;
