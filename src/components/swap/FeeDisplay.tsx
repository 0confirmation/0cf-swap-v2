import React, { useContext } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js';
import { StoreContext } from '../../stores/ZeroStore';
import { SUPPORTED_TOKEN_NAMES } from '../../config/constants/tokens';
import FeeRow, { FeeRowProps } from './FeeRow';

export interface SwapToProps {
	selectedCoin: SUPPORTED_TOKEN_NAMES;
	gasFee: BigNumber | undefined;
}

const useStyles = makeStyles((theme: Theme) => ({
	feePaper: {
		padding: theme.spacing(2),
		margin: theme.spacing(2),
	},
	feeRow: {
		padding: theme.spacing(0.5, 0, 0.5, 0),
	},
	feeInfoLeft: {
		fontWeight: 'bold',
		marginTop: 'auto',
		marginBottom: 'auto',
	},
	feeInfoRight: {
		textAlign: 'right',
	},
	feeInfoTextHeader: {
		marginBottom: '-5px',
	},
}));

export const FeeDisplay = observer((props: SwapToProps): JSX.Element => {
	const classes = useStyles();
	const store = useContext(StoreContext);
	const {
		wallet: { connectedAddress },
		currency: { toToken },
		fees: { gasFee, mintFee },
	} = store;
	const { selectedCoin } = props;

	const feeInfo: FeeRowProps[] = [
		{
			title: 'Rate',
			description: `1 BTC = ${toToken(new BigNumber(1), selectedCoin.toLowerCase(), 'bitcoin', 2)}${' '} ${
				store.currency.tokenMap![selectedCoin.toLowerCase()].symbol
			}`,
			collapsable: false,
		},
		{
			title: 'Protocol Fees',
			secondaryTitle: [`${mintFee}% renVM Mint`, '0.1% Zero Loan'],
			description: '0.00042 BTC',
			secondaryDescription: '($226.01)',
			collapsable: true,
		},
		{
			title: 'Approx. Slippage',
			description: '0.01%',
			collapsable: false,
		},
		{
			title: 'Estimated Gas Cost',
			secondaryTitle: [`@${gasFee ? gasFee.dividedBy(1e18).toFixed(2) : '-'} gwei`],
			description: '0.00001 BTC',
			secondaryDescription: '($5.40)',
			collapsable: false,
		},
	];

	const _getFees = () => {
		return feeInfo.map((fee: FeeRowProps): JSX.Element => {
			return (
				<FeeRow
					key={fee.title}
					title={fee.title}
					secondaryTitle={fee.secondaryTitle}
					description={fee.description}
					secondaryDescription={fee.secondaryDescription ? fee.secondaryDescription : undefined}
					collapsable={fee.collapsable}
				/>
			);
		});
	};

	return (
		<Paper variant="outlined" className={classes.feePaper}>
			{/* We only show the gas fee row if there is a network with a gas fee associated */}
			{connectedAddress ? (
				_getFees()
			) : (
				<Typography variant="h6">Connect Wallet to see transaction details</Typography>
			)}
		</Paper>
	);
});

export default FeeDisplay;
