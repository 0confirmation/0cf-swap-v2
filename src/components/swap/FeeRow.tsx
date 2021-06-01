import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Typography, ListItem, IconButton, Collapse } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import dropdownIcon from '@iconify-icons/gridicons/dropdown';

export interface FeeRowProps {
	title: string;
	secondaryTitle?: string[];
	description: string;
	secondaryDescription?: string;
	collapsable: boolean;
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
		padding: 0,
		marginBottom: '-5px',
		[theme.breakpoints.down('sm')]: {
			fontSize: '.8rem',
		},
	},
	collapsableFeeInfoTextHeader: {
		fontWeight: 'bold',
		padding: 0,
		marginBottom: '-5px',
		cursor: 'pointer',
		[theme.breakpoints.down('sm')]: {
			fontSize: '.8rem',
		},
	},
	expand: {
		transform: 'rotate(0deg)',
		pointerEvents: 'none',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
}));

export const FeeRow = observer((props: FeeRowProps) => {
	const classes = useStyles();
	const { title, secondaryTitle, description, secondaryDescription, collapsable } = props;

	const [expanded, setExpanded] = useState('');

	return (
		<Grid container direction="row" className={classes.feeRow}>
			<Grid item xs={5} className={collapsable ? '' : classes.feeInfoLeft}>
				{collapsable ? (
					<>
						<ListItem
							className={classes.collapsableFeeInfoTextHeader}
							onClick={() => setExpanded(expanded === title ? '' : title)}
						>
							{title}
							<IconButton
								size="small"
								className={classes.expand + ' ' + (expanded === title ? classes.expandOpen : '')}
								aria-label="show more"
							>
								<Icon icon={dropdownIcon} />
							</IconButton>
						</ListItem>
						<Collapse in={expanded === title} timeout="auto" unmountOnExit>
							<Grid container direction="column">
								{secondaryTitle
									? secondaryTitle.map((fee) => (
											<Typography key={fee} variant="caption" color="textSecondary">
												{fee}
											</Typography>
									  ))
									: null}
							</Grid>
						</Collapse>
					</>
				) : (
					<>
						<div className={classes.feeInfoTextHeader}>{title}</div>
						<Grid container direction="column">
							{secondaryTitle
								? secondaryTitle.map((fee) => (
										<Typography key={fee} variant="caption" color="textSecondary">
											{fee}
										</Typography>
								  ))
								: null}
						</Grid>
					</>
				)}
			</Grid>
			<Grid item xs={7} className={classes.feeInfoRight}>
				<Typography className={classes.feeInfoTextHeader}>{description}</Typography>
				{secondaryDescription ? (
					<Typography variant="caption" color="textSecondary">
						{secondaryDescription}
					</Typography>
				) : null}
			</Grid>
		</Grid>
	);
});

export default FeeRow;
