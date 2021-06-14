import Sidebar from './components/common/Sidebar/Sidebar';
import Navbar from './components/common/Navbar/Navbar';
import { Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import store, { StoreProvider } from './stores/Store';
import { MobxRouter, startRouter } from 'mobx-router';
import routes from './config/routes';
import { Snackbar } from './components/common/Snackbar';
import { sushiTheme } from './config/themes';

const theme = sushiTheme;

startRouter(routes, store, {
	html5history: true, // or false if you want to use hash based routing
});

function App() {
	return (
		<div>
			<StoreProvider value={store}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Snackbar>
						<Navbar />
						<Container maxWidth={false}>
							<MobxRouter store={store} />
						</Container>
						<Sidebar />
					</Snackbar>
				</ThemeProvider>
			</StoreProvider>
		</div>
	);
}

export default App;
