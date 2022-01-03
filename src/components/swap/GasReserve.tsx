import React, { ChangeEvent, MouseEvent, useContext } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { Grid, Paper, Checkbox, Typography } from '@material-ui/core';
import { StoreContext } from '../../stores/Store';
import { observer } from 'mobx-react-lite';

export interface GasReserveProps {
	checked: boolean;
	reserveAmount: number;
	handleReserveAmount: (_: MouseEvent<HTMLElement, globalThis.MouseEvent>, amount: number) => void;
	handleChecked: (_: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const GasReserve = observer((props: GasReserveProps) => {
	const { checked, reserveAmount, handleReserveAmount, handleChecked } = props;
	const store = useContext(StoreContext);
	const {
		wallet: { network: baseCurrency },
	} = store;
	const currency = baseCurrency.name.toUpperCase();
	return (
		<Grid container justifyContent="center">
			<Paper variant="outlined" style={{ padding: '8px', width: '85%' }}>
				<Grid container direction="row" justifyContent="center">
					<Grid container direction="row" alignItems="center" justifyContent="center">
						<Checkbox size="small" checked={checked} onChange={handleChecked}></Checkbox>
						<Typography>Reserve some {currency} for gas</Typography>
					</Grid>
					{checked ? (
						<ToggleButtonGroup value={reserveAmount} exclusive onChange={handleReserveAmount}>
							<ToggleButton value={0.01}>0.01 {currency}</ToggleButton>
							<ToggleButton value={0.1}>0.1 {currency}</ToggleButton>
							<ToggleButton value={1}>1 {currency}</ToggleButton>
						</ToggleButtonGroup>
					) : null}
				</Grid>
			</Paper>
		</Grid>
	);
});
