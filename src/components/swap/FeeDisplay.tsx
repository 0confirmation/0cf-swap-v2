import React, { useContext } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
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
		currency: { toToken },
	} = store;
	const { selectedCoin, gasFee } = props;

	const feeInfo: FeeRowProps[] = [
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
				/>
			);
		});
	};

	return (
		<Paper variant="outlined" className={classes.feePaper}>
			{_getFees()}
			{/* We only show the gas fee row if there is a network with a gas fee associated */}
			{gasFee ? (
				<FeeRow
					key="Estimated Gas Cost"
					title="Estimated Gas Cost"
					secondaryTitle={`@${gasFee.dividedBy(1e18).toFixed(2)} gwei`}
					description="0.00001 BTC"
					secondaryDescription="($5.40)"
				/>
			) : null}
		</Paper>
	);
});

export default FeeDisplay;
