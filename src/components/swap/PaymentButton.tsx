import React from 'react';
import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import BitcoinPayment from '../bitcoin/BitcoinPayment';

export interface PaymentModalProps {
	open?: boolean;
	handleClose?: () => void;
	fromAmount: string;
	toAmount: string;
	priceImpact: string;
	fromCurrency: string;
	toCurrency: string;
}

export const PaymentButton = observer((props: PaymentModalProps) => {
	return (
		<Grid container justifyContent="center">
			<BitcoinPayment {...props} />
		</Grid>
	);
});

export default PaymentButton;
