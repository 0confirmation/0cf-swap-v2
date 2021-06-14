import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Logo from '../Logo';
import { IconButton } from '@material-ui/core';
import { Icon } from '@iconify/react';
import menuIcon from '@iconify-icons/oi/menu';

import { StoreContext } from '../../../stores/Store';

export const MobileHeader = observer(() => {
	const store = useContext(StoreContext);
	const { toggleSidebar } = store.ui;
	return (
		<>
			<Logo />
			<IconButton onClick={() => toggleSidebar()}>
				<Icon icon={menuIcon} />
			</IconButton>
		</>
	);
});

export default MobileHeader;
