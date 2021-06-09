import React, { ChangeEvent, MouseEvent } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { Grid, Paper, Checkbox, Typography } from '@material-ui/core';

export interface GasReserveProps {
	checked: boolean;
	reserveAmount: number;
	handleReserveAmount: (_: MouseEvent<HTMLElement, globalThis.MouseEvent>, amount: number) => void;
	handleChecked: (_: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const GasReserve = (props: GasReserveProps) => {
	const { checked, reserveAmount, handleReserveAmount, handleChecked } = props;
	return (
		<Grid container justify="center">
			<Paper variant="outlined" style={{ padding: '8px', width: '85%' }}>
				<Grid container direction="row" justify="center">
					<Grid container direction="row" alignItems="center" justify="center">
						<Checkbox size="small" checked={checked} onChange={handleChecked}></Checkbox>
						<Typography>Reserve some ETH for gas</Typography>
					</Grid>
					{checked ? (
						<ToggleButtonGroup value={reserveAmount} exclusive onChange={handleReserveAmount}>
							<ToggleButton value={0.01}>0.01 ETH</ToggleButton>
							<ToggleButton value={0.1}>0.1 ETH</ToggleButton>
							<ToggleButton value={1}>1 ETH</ToggleButton>
						</ToggleButtonGroup>
					) : null}
				</Grid>
			</Paper>
		</Grid>
	);
};
