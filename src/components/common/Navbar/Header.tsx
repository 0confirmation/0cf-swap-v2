import React from 'react';
import { observer } from 'mobx-react-lite';
import Logo from '../Logo';
import WalletButton from '../WalletButton';

export const Header = observer(() => {
  return (
    <>
      <Logo />
      <WalletButton />
    </>
  );
});

export default Header;
