import React, { Fragment } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';

const CollapsibleTable = ({ title, datas, renderRow }) => {
	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						<TableCell />
						{title.map((text, key) => (
							<TableCell
								align="center"
								key={key}
							>
								{text}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{datas &&
						datas.map((data, index) => (
							<Fragment key={index}>{renderRow(data, index)}</Fragment>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default CollapsibleTable;
