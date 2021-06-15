import React, { useContext } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js';
import { StoreContext } from '../../stores/Store';
import { SUPPORTED_TOKEN_NAMES } from '../../config/constants/tokens';
import FeeRow, { FeeRowProps } from './FeeRow';

export interface SwapToProps {
	selectedCoin: SUPPORTED_TOKEN_NAMES;
	amount: string;
	priceImpact: string;
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

export const FeeDisplay = observer((props: SwapToProps): JSX.Element | null => {
	const classes = useStyles();
	const store = useContext(StoreContext);
	const {
		wallet: { connectedAddress },
		currency: { toToken },
		fees: { gasFee, mintFee, btcFee, zeroFee },
		zero: { keepers },
	} = store;
	const { selectedCoin, amount, priceImpact } = props;

	const bnAmount = new BigNumber(amount);

	const _calcProtocolFees = (): string => {
		if (!mintFee.scalar || !gasFee.value || !zeroFee.scalar || !btcFee.value) return '0';
		return bnAmount
			.multipliedBy(mintFee.scalar)
			.plus(bnAmount.multipliedBy(zeroFee.scalar))
			.plus(btcFee.value)
			.toString();
	};

	const _calcTotalFee = (): string => {
		if (!mintFee.scalar || !gasFee.value || !zeroFee.scalar || !btcFee.value) return '0';

		// TODO: include gas estimate in here
		return bnAmount
			.multipliedBy(mintFee.scalar)
			.plus(bnAmount.multipliedBy(zeroFee.scalar))
			.plus(btcFee.value)
			.plus(gasFee.value)
			.toString();
	};

	const feeInfo: FeeRowProps[] = [
		{
			title: 'Keepers Connected',
			description: `${keepers ? Object.keys(keepers).length : 0}`,
			collapsable: false,
		},
		{
			title: 'Rate',
			description: `1 BTC = ${toToken(new BigNumber(1), selectedCoin, SUPPORTED_TOKEN_NAMES.WBTC, 2)}${' '} ${
				store.currency.tokenMap![selectedCoin].symbol
			}`,
			collapsable: false,
		},
		{
			title: 'Protocol Fees',
			secondaryTitle: [
				`${mintFee.scalar ? mintFee.scalar.multipliedBy(1e2) : '-'}% renVM Mint`,
				`${zeroFee.scalar ? zeroFee.scalar.multipliedBy(1e2) : '-'}% Zero Loan`,
				`${btcFee.value ? btcFee.value : '-'} BTC Miner Fee`,
			],
			description: `${_calcProtocolFees()} BTC`,
			secondaryDescription: `(${toToken(
				new BigNumber(_calcProtocolFees()),
				selectedCoin,
				SUPPORTED_TOKEN_NAMES.WBTC,
				2,
			)} ${' '} ${store.currency.tokenMap![selectedCoin].symbol})`,
			collapsable: true,
		},
		{
			title: 'Approx. Slippage',
			description: `${priceImpact}%`,
			collapsable: false,
		},
		{
			title: 'Estimated Gas Cost',
			secondaryTitle: [`@${gasFee.scalar ? gasFee.scalar.dividedBy(1e18).toFixed(2) : '-'} gwei`],
			description: `${gasFee.value ? gasFee.value : '-'} BTC`,
			secondaryDescription: `(${
				gasFee.value ? toToken(gasFee.value, selectedCoin, SUPPORTED_TOKEN_NAMES.WBTC, 2) : '-'
			} ${store.currency.tokenMap![selectedCoin].symbol})`,
			collapsable: false,
		},
		{
			title: 'Total Est. Fees',
			description: `${_calcTotalFee()} BTC`,
			secondaryDescription: `(${toToken(
				new BigNumber(_calcTotalFee()),
				selectedCoin,
				SUPPORTED_TOKEN_NAMES.WBTC,
				2,
			)}${' '} ${store.currency.tokenMap![selectedCoin].symbol})`,
			collapsable: false,
		},
	];

	const _getFees = () => {
		return feeInfo.map((fee: FeeRowProps): JSX.Element => {
			return (
				<FeeRow
					key={`feerow-${fee.title}`}
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
		/* We only show the fee container if there is a network with a gas fee associated */
		connectedAddress ? (
			<Paper variant="outlined" className={classes.feePaper}>
				{_getFees()}
			</Paper>
		) : null
	);
});

export default FeeDisplay;
