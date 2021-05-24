import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../stores/ZeroStore';

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: theme.spacing(0),
		width: '100%',
	},
	select: {
		height: '2.1rem',
		fontSize: '.9rem',
		overflow: 'hidden',
		marginRight: theme.spacing(1),
		minWidth: '93px',
	},
	walletButton: {
		'&:hover': {
			opacity: '0.8',
		},
		color: '#FFFFFF',
		backgroundColor: theme.palette.secondary.main,
		opacity: '0.90',
		maxHeight: '2rem',
		marginTop: 'auto',
		marginBottom: 'auto',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
	},
}));

interface Props {}

const shortenAddress = (address: string) => {
	return address.slice(0, 7) + '...' + address.slice(address.length - 7, address.length);
};

const WalletButton: React.FC<Props> = observer(() => {
	const classes = useStyles();
	const store = useContext(StoreContext);
	const { connectedAddress, onboard } = store.wallet;

	const connect = async () => {
		if (!onboard) return;
		else {
			const previouslySelectedWallet = window.localStorage.getItem('selectedWallet');
			if (previouslySelectedWallet != null) await onboard.walletSelect(previouslySelectedWallet);
			else if (!(await onboard?.walletSelect())) return;
			const readyToTransact = await onboard.walletCheck();
			if (readyToTransact) {
				store.wallet.connect(onboard);
			}
		}
	};

	return (
		<Button
			disableElevation
			variant="contained"
			color="secondary"
			className={classes.walletButton}
			onClick={() => {
				if (!connectedAddress) connect();
				else store.wallet.disconnect();
			}}
		>
			{!!connectedAddress ? shortenAddress(connectedAddress) : 'CONNECT'}
		</Button>
	);
});

export default WalletButton;
