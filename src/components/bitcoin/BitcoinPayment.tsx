import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../stores/Store';
import { connect } from '../common/WalletButton';
import PaymentModal from './PaymentModal';
import { PaymentModalProps } from '../swap/PaymentButton';

const useStyles = makeStyles((theme: Theme) => ({
	submitButton: {
		background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}) repeat scroll 0% 0% border-box`,
		color: theme.palette.text.primary,
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		width: '85%',
		borderRadius: '8px',
		paddingTop: theme.spacing(1.5),
		paddingBottom: theme.spacing(1.5),
		fontSize: '1.2rem',
	},
}));

export const BitcoinPayment = observer((props: PaymentModalProps): JSX.Element => {
	const store = useContext(StoreContext);
	const { connectedAddress } = store.wallet;
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleConnect = () => {
		connect(store);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const isActive = (): boolean => {
		return !!connectedAddress;
	};

	return (
		<>
			<Button
				className={classes.submitButton}
				onClick={!isActive() ? handleConnect : handleOpen}
				variant="contained"
			>
				{!isActive() ? 'Connect Wallet' : 'Review Order'}
			</Button>
			<PaymentModal open={open} handleClose={handleClose} {...props} />
		</>
	);
});

export default BitcoinPayment;
