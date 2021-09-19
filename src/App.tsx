import Sidebar from './components/common/Sidebar/Sidebar';
import Navbar from './components/common/Navbar/Navbar';
import { Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import { Store, StoreProvider } from './stores/Store';
import { MobxRouter } from 'mobx-router';
import { Snackbar } from './components/common/Snackbar';
import { sushiTheme } from './config/themes';

import { createZeroUser, createZeroConnection } from "zero-protocol/dist/lib/zero";

import { InMemoryPersistenceAdapter } from "zero-protocol/dist/lib/persistence/inMemory";

declare global {
    interface Window { [key: string]: any; }
}
(async () => {
  window.zero = createZeroUser(await createZeroConnection('/dns4/lourdehaufen.dynv6.net/tcp/443/wss/p2p-webrtc-star/'), new InMemoryPersistenceAdapter());
  window.zero.conn.on('peer:discovery', async (peer: any) => { console.log(peer.peerId); });
})().catch((err) => console.error(err));

const theme = sushiTheme;

export interface AppProps {
	store: Store;
}

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
