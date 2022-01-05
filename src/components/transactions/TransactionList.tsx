import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { MainContainer, PaperContainer } from '../common/Styles';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { StoreContext } from '../../stores/Store';
import TransactionRow from './TransactionRow';
import { TRANSACTION_STATUS } from '../../config/constants/ui';
import { storage } from '../../utils/storage';
import { TransferRequestWithStatus } from 'zero-protocol/dist/lib/persistence/types';

const useStyles = makeStyles((theme: Theme) => ({
	txPaper: {
		padding: theme.spacing(2),
	},
	txHeader: {
		backgroundColor: '#2B2C3A',
		width: `calc(100% + ${theme.spacing(4)}px)`,
		margin: `-${theme.spacing(2)}px -${theme.spacing(2)}px 0px -${theme.spacing(2)}px`,
		paddingRight: theme.spacing(2),
		borderRadius: `${theme.spacing(1)}px ${theme.spacing(1)}px 0px 0px`,
	},
	txHeaderText: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		fontWeight: 'bold',
	},
	txTableTitles: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(1),
		textAlign: 'center',
	},
	connectWalletText: {
		textAlign: 'center',
		paddingTop: theme.spacing(2),
	},
}));

export const TransactionList = observer(() => {
	const store = useContext(StoreContext);
	const {
		wallet: { connectedAddress },
	} = store;
	const classes = useStyles();

	const [transfers, setTransfers] = useState<TransferRequestWithStatus[]>();

	const getAllTransfers = async () => {
		setTransfers(await storage.getAllTransferRequests());
	};

	useEffect(() => {
		getAllTransfers();
	}, [connectedAddress]);

	console.log('transfers:', transfers);

	return (
		<MainContainer>
			<PaperContainer>
				<Grid item xs={12} sm={8}>
					<Paper className={classes.txPaper}>
						<Container className={classes.txHeader}>
							<Typography className={classes.txHeaderText} variant="h5">
								Recent Transactions
							</Typography>
						</Container>
						{connectedAddress ? (
							<>
								<Grid container direction="row" className={classes.txTableTitles}>
									<Grid item xs={3}>
										<Typography color="textSecondary">Created</Typography>
									</Grid>
									<Grid item xs={3}>
										<Typography color="textSecondary">Escrow Address</Typography>
									</Grid>
									<Grid item xs={3}>
										<Typography color="textSecondary">Confirmations</Typography>
									</Grid>
									<Grid item xs={3}>
										<Typography color="textSecondary">Status</Typography>
									</Grid>
								</Grid>
								<TransactionRow
									date="6/25"
									address="0xABC...DEF"
									confirmations="2/6"
									status={TRANSACTION_STATUS['Transaction Found']}
								/>
								<TransactionRow
									date="6/22"
									address="0xDEF...ABC"
									confirmations="4/6"
									status={TRANSACTION_STATUS['Request Created']}
								/>
								<TransactionRow
									date="6/21"
									address="0x123...456"
									confirmations="5/6"
									status={TRANSACTION_STATUS['Keeper Assigned']}
								/>
								<TransactionRow
									date="6/19"
									address="0x321...654"
									confirmations="5/6"
									status={TRANSACTION_STATUS['Pending Release']}
								/>
								<TransactionRow
									date="6/05"
									address="0xZZZ...OOO"
									confirmations="6/6"
									status={TRANSACTION_STATUS.Complete}
								/>
							</>
						) : (
							<Typography variant="h6" className={classes.connectWalletText}>
								Please connect wallet to see past transactions.
							</Typography>
						)}
					</Paper>
				</Grid>
			</PaperContainer>
		</MainContainer>
	);
});

export default TransactionList;
