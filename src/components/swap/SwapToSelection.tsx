import React, { useContext, useState, useEffect } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { StoreContext } from '../../stores/ZeroStore';
import { getTokens, SUPPORTED_TOKEN_NAMES, TokenDefinition } from '../../config/constants/tokens';
import { SwapDisplay } from './SwapDisplay';
import { Theme, makeStyles } from '@material-ui/core/styles';

export interface SelectionProps {
	onTokenChange: (name: SUPPORTED_TOKEN_NAMES) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
	select: {
		width: '100%',
	},
}));

const SwapToSelection = (props: SelectionProps): JSX.Element => {
	const classes = useStyles();
	const { onTokenChange } = props;
	const store = useContext(StoreContext);
	const [coin, setCoin] = useState(SUPPORTED_TOKEN_NAMES.USDC);

	useEffect(() => {
		if (onTokenChange) {
			onTokenChange(coin);
		}
		/* eslint-disable */
	}, [coin]);

	const selections = getTokens(store.wallet.network.name);
	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setCoin(event.target.value as SUPPORTED_TOKEN_NAMES);
	};

	return (
		<Select className={classes.select} value={coin} onChange={handleChange} id="to-currency" labelId="to-currency">
			{selections.map((currency: TokenDefinition): JSX.Element | null => {
				// There is no benefit in swapping to wBTC so don't offer as an option.
				if (currency.symbol === 'wBTC') return null;
				return (
					<MenuItem className={classes.select} key={currency.symbol} value={currency.name}>
						<SwapDisplay icon={currency.icon} name={currency.symbol} />
					</MenuItem>
				);
			})}
		</Select>
	);
};

export default SwapToSelection;
