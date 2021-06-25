import Sidebar from './components/common/Sidebar/Sidebar';
import Navbar from './components/common/Navbar/Navbar';
import { Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import { Store, StoreProvider } from './stores/Store';
import { MobxRouter } from 'mobx-router';
import { Snackbar } from './components/common/Snackbar';
import { sushiTheme } from './config/themes';

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
