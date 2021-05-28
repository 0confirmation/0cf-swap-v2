import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../stores/ZeroStore';
import { connect } from '../common/WalletButton';
import PaymentModal from './PaymentModal';

const useStyles = makeStyles((theme: Theme) => ({
	submitButton: {
		background: `linear-gradient(${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%) left bottom no-repeat`,
		color: theme.palette.text.primary,
		fontWeight: 'bold',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

export const BitcoinPayment = observer((): JSX.Element => {
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
				{!isActive() ? 'CONNECT WALLET' : 'REVIEW ORDER'}
			</Button>
			<PaymentModal open={open} handleClose={handleClose} />
		</>
	);
});

export default BitcoinPayment;
