import React, { useContext } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js';
import { StoreContext } from '../../stores/ZeroStore';
import { SUPPORTED_TOKEN_NAMES } from '../../config/constants/tokens';
import FeeRow, { FeeRowProps } from './FeeRow';
import { FeeDescription } from '../../config/models/currency';

export interface SwapToProps {
	selectedCoin: SUPPORTED_TOKEN_NAMES;
	amount: string;
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
	} = store;
	const { selectedCoin, amount } = props;

	const bnAmount = new BigNumber(amount);

	const _calcTotalFee = (): string => {
		console.log(
			'check:',
			bnAmount.toString(),
			mintFee.scalar?.toString(),
			gasFee.value?.toString(),
			btcFee.value?.toString(),
		);
		if (!mintFee.scalar || !gasFee.value || !zeroFee.scalar || !btcFee.value) return '0';

		// TODO: include gas estimate in here
		return bnAmount
			.multipliedBy(mintFee.scalar.dividedBy(1e2))
			.plus(bnAmount.multipliedBy(zeroFee.scalar.dividedBy(1e2)))
			.plus(btcFee.value)
			.toString();
	};

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
			secondaryTitle: [
				`${mintFee.scalar}% renVM Mint`,
				`${zeroFee.scalar}% Zero Loan`,
				`${btcFee.value} BTC Miner Fee`,
			],
			description: `${_calcTotalFee()} BTC`,
			secondaryDescription: `(${toToken(
				new BigNumber(_calcTotalFee()),
				selectedCoin.toLowerCase(),
				'bitcoin',
				2,
			)} ${' '} ${store.currency.tokenMap![selectedCoin.toLowerCase()].symbol})`,
			collapsable: true,
		},
		{
			title: 'Approx. Slippage',
			description: '0.01%',
			collapsable: false,
		},
		{
			title: 'Estimated Gas Cost',
			secondaryTitle: [`@${gasFee.value ? gasFee.value.dividedBy(1e18).toFixed(2) : '-'} gwei`],
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
		/* We only show the fee container if there is a network with a gas fee associated */
		connectedAddress ? (
			<Paper variant="outlined" className={classes.feePaper}>
				{_getFees()}
			</Paper>
		) : null
	);
});

export default FeeDisplay;
