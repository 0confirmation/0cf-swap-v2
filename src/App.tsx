import Sidebar from './components/common/Sidebar/Sidebar';
import Navbar from './components/common/Navbar/Navbar';
import { Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import { Store, StoreProvider } from './stores/Store';
import { MobxRouter } from 'mobx-router';
import { Snackbar } from './components/common/Snackbar';
import { sushiTheme } from './config/themes';
import { TrivialUnderwriterTransferRequest, createZeroConnection, createZeroKeeper, createZeroUser } from 'zero-protocol/dist/lib/zero';
import { Wallet } from "@ethersproject/wallet";

const theme = sushiTheme;

export interface AppProps {
	store: Store;
}

const SIGNALING_MULTIADDR = '/dns4/lourdehaufen.dynv6.net/tcp/443/wss/p2p-webrtc-star/';

(async () => {
  const user = (window as any).user = createZeroUser(await createZeroConnection(SIGNALING_MULTIADDR));
  const keeper = (window as any).keeper = createZeroKeeper(await createZeroConnection(SIGNALING_MULTIADDR));
  await Promise.all([ user, keeper ].map(async (v) => await v.conn.start()));
  const keeperWallet = Wallet.createRandom();
  await keeper.advertiseAsKeeper(keeperWallet.address);
  await user.subscribeKeepers();
})().catch((err) => console.error(err));


function App(props: AppProps) {
	return (
		<StoreProvider value={props.store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Snackbar>
					<Navbar />
					<Container maxWidth={false} style={{ height: '100%' }}>
						<MobxRouter store={props.store} />
					</Container>
					<Sidebar />
				</Snackbar>
			</ThemeProvider>
		</StoreProvider>
	);
}

export default App;
