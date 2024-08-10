import * as React from 'react';
import { Button, Typography, Toolbar, Box, AppBar } from '@mui/material';
// import { RiCustomerService2Line } from 'react-icons/ri';

export default function ButtonAppBar() {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						會員服務時間異動
					</Typography>
					<Button color="inherit"></Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
