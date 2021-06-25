import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../stores/Store';
import { connect } from '../common/WalletButton';
import PaymentModal from './PaymentModal';
import { PaymentModalProps } from '../swap/PaymentButton';
import { BUTTON_STATUS } from '../../config/constants/ui';

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
	const {
		wallet: { connectedAddress },
		zero: { keepers },
	} = store;
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

	const buttonStatus = (): BUTTON_STATUS => {
		if (process.env.NODE_ENV !== 'production') return BUTTON_STATUS.keeperConnected;
		if (!!connectedAddress && !!keepers && Object.keys(keepers).length > 0) return BUTTON_STATUS.keeperConnected;
		else if (!!connectedAddress && (!keepers || Object.keys(keepers).length <= 0)) return BUTTON_STATUS.noKeeper;
		else return BUTTON_STATUS.disconnected;
	};

	const buttonFunction = () => {
		const status = buttonStatus();
		switch (status) {
			case BUTTON_STATUS.disconnected:
				return handleConnect();
			case BUTTON_STATUS.keeperConnected:
				return handleOpen();
			default:
				return null;
		}
	};

	return (
		<>
			<Button className={classes.submitButton} onClick={buttonFunction} variant="contained">
				{buttonStatus()}
			</Button>
			<PaymentModal open={open} handleClose={handleClose} {...props} />
		</>
	);
});

export default BitcoinPayment;
