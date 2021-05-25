import React, { useContext } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js';
import { StoreContext } from '../../stores/ZeroStore';
import { SUPPORTED_TOKEN_NAMES } from '../../config/constants/tokens';
import FeeRow from './FeeRow';

export interface SwapToProps {
	selectedCoin: SUPPORTED_TOKEN_NAMES;
}

export interface FeeRowDetails {
	title: string;
	description: string;
	secondaryDescription?: string;
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
		currency: { toToken },
	} = store;
	const { selectedCoin } = props;

	const feeInfo: FeeRowDetails[] = [
		{
			title: 'Rate',
			description: `1 BTC = ${toToken(new BigNumber(1), selectedCoin.toLowerCase(), 'bitcoin', 2)}${' '} ${
				store.currency.tokenMap![selectedCoin.toLowerCase()].symbol
			}`,
		},
		{
			title: 'Protocol Fees',
			description: '0.00042 BTC',
			secondaryDescription: '($226.01)',
		},
		{
			title: 'Approx. Slippage',
			description: '0.01%',
		},
		{
			title: 'Estimated Gas Cost',
			description: '0.00001 BTC',
			secondaryDescription: '($5.40)',
		},
	];

	const _getFees = () => {
		return feeInfo.map((fee: FeeRowDetails): JSX.Element => {
			return (
				<FeeRow
					key={fee.title}
					title={fee.title}
					description={fee.description}
					secondaryDescription={fee.secondaryDescription ? fee.secondaryDescription : undefined}
				/>
			);
		});
	};

	return (
		<Paper variant="outlined" className={classes.feePaper}>
			{_getFees()}
		</Paper>
	);
});
