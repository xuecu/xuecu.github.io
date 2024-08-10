import './App.css';
import Navbar from './components/nav-bar/nav-bar.componet';
import Menu from './components/menu/menu.components';
import { Grid, Box } from '@mui/material';
import { MenuProvider } from './contexts/menu.contexts';
import { MemberProvider } from './contexts/member.contexts';

function App() {
	return (
		<MenuProvider>
			<MemberProvider>
				<Grid
					container
					direction="column"
					spacing={2}
				>
					<Grid item>
						<Navbar />
					</Grid>
					<Grid item>
						<Box margin={5}>
							<Menu />
						</Box>
					</Grid>
				</Grid>
			</MemberProvider>
		</MenuProvider>
	);
}

export default App;
