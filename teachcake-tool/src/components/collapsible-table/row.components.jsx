import React, { useState, useEffect, Fragment } from 'react';
import {
	Box,
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	TextField,
	Button,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ProgressBar from '../progress-bar/progress-bar.components';
import { dateToYMD, diffDays } from '../../utilities/function/dayjs.func';
import dayjs from 'dayjs';

export const ContractsRow = ({ data, onSave, showDate }) => {
	const {
		id,
		agreed_at,
		values: {
			orderId,
			orderProducts,
			invoice: { email, name },
		},
		server_date,
	} = data;

	const [startDate, setStartDate] = useState(dayjs(new Date()));
	const [endDate, setEndDate] = useState(dayjs(new Date()));
	const [serverDate, setServerDate] = useState(server_date ? dayjs(server_date) : null);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState('');

	const handleState = {
		startDate: startDate,
		endDate: endDate,
		setLoading: setLoading,
		setProgress: setProgress,
		error: error,
		setError: setError,
		setMessage: setMessage,
	};

	const [open, setOpen] = useState(false);

	useEffect(() => {
		const diffDay = diffDays(startDate, endDate);
		if (diffDay >= 0) setServerDate(dayjs(server_date).add(`${diffDay + 1}`, 'day'));
		else setServerDate(dayjs(server_date));
	}, [startDate, endDate]);

	const handleSaveClick = () => onSave(id, handleState);
	const handleSetStartDate = (event) => {
		setStartDate(dayjs(event.target.value));
	};
	const handleSetEndDate = (event) => {
		setEndDate(dayjs(event.target.value));
	};
	return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell align="center">
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell
					component="th"
					scope="row"
					align="center"
				>
					{orderId}
				</TableCell>
				<TableCell align="center">{dateToYMD(agreed_at)}</TableCell>
				<TableCell align="center">{name}</TableCell>
				<TableCell align="center">{email}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					style={{ paddingBottom: 0, paddingTop: 0 }}
					colSpan={6}
				>
					<Collapse
						in={open}
						timeout="auto"
						unmountOnExit
					>
						{agreed_at ? (
							<Box sx={{ margin: 1 }}>
								<Typography
									variant="h6"
									gutterBottom
									component="div"
								>
									訂單詳情
								</Typography>
								<Table
									size="small"
									aria-label="purchases"
								>
									<TableHead>
										<TableRow>
											<TableCell>專案名稱</TableCell>
											<TableCell>截止日</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{orderProducts.map((product, index) => (
											<TableRow key={index}>
												<TableCell
													component="th"
													scope="row"
												>
													{product.name}
												</TableCell>
												<TableCell
													component="th"
													scope="row"
												>
													{product.ended_at
														? dateToYMD(product.ended_at)
														: '沒有時間QQ'}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								<Box
									sx={{ minWidth: 200, margin: 2 }}
									display="flex"
									alignItems="center"
									justifyContent="flex-end"
								>
									{showDate && (
										<Fragment>
											<Box sx={{ minWidth: 50, margin: 2 }}>開始日</Box>
											<Box sx={{ minWidth: 200, margin: 2 }}>
												<TextField
													id="start-date"
													variant="outlined"
													type="date"
													value={dateToYMD(startDate)}
													onChange={handleSetStartDate}
												/>
											</Box>
										</Fragment>
									)}
									<Box sx={{ minWidth: 50, margin: 2 }}>結束日</Box>
									<Box sx={{ minWidth: 200, margin: 2 }}>
										<TextField
											id="end-date"
											variant="outlined"
											type="date"
											value={dateToYMD(endDate)}
											onChange={handleSetEndDate}
										/>
									</Box>
									{showDate && (
										<Fragment>
											<Box sx={{ minWidth: 50, margin: 2 }}>確認到期日</Box>
											<Box sx={{ minWidth: 50, margin: 2 }}>
												{serverDate && dateToYMD(serverDate)}
											</Box>
										</Fragment>
									)}
									<Button
										variant="contained"
										onClick={handleSaveClick}
										disabled={Number(progress) === 0 && loading ? true : false}
									>
										{Number(progress) === 0 && Number(progress) === 100
											? '正在送出...'
											: '送出'}
									</Button>
								</Box>
								{loading && (
									<ProgressBar
										value={progress}
										loading={loading}
										error={error}
										message={message}
									/>
								)}
							</Box>
						) : (
							<Box sx={{ margin: 1 }}>無簽約</Box>
						)}
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
};

export const ProductsRow = ({ data, onSave, onResetDate, createResetDate }) => {
	const { id, created_at, status, order_products } = data;

	const [orderProduct, setOrderProduct] = useState(order_products);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState('');

	const handleState = {
		orderProduct: orderProduct,
		setOrderProduct: setOrderProduct,
		setLoading: setLoading,
		setProgress: setProgress,
		setError: setError,
		setMessage: setMessage,
	};

	const [open, setOpen] = useState(false);
	const handleSaveClick = () => onSave(handleState);
	const handleResetDate = () => onResetDate(handleState);
	const handleCreateReset = (orderProductId, value) =>
		createResetDate(orderProductId, value, handleState);

	return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell align="center">
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell
					component="th"
					scope="row"
					align="center"
				>
					{id}
				</TableCell>
				<TableCell align="center">{dateToYMD(created_at)}</TableCell>
				<TableCell align="center">{status}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					style={{ paddingBottom: 0, paddingTop: 0 }}
					colSpan={6}
				>
					<Collapse
						in={open}
						timeout="auto"
						unmountOnExit
					>
						<Box sx={{ margin: 1 }}>
							<Typography
								variant="h6"
								gutterBottom
								component="div"
							>
								訂單詳情
							</Typography>
							<Table
								size="small"
								aria-label="purchases"
							>
								<TableHead>
									<TableRow>
										<TableCell>專案名稱</TableCell>
										<TableCell>截止日</TableCell>
										<TableCell>修改日</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{orderProduct.map((product, index) => (
										<TableRow key={index}>
											<TableCell
												component="th"
												scope="row"
											>
												{product.name}
											</TableCell>
											<TableCell
												component="th"
												scope="row"
											>
												{product.ended_at
													? dateToYMD(product.ended_at)
													: '沒有時間QQ'}
											</TableCell>
											<TableCell
												component="th"
												scope="row"
											>
												<TextField
													id="reset-date"
													variant="outlined"
													type="date"
													value={product.reset_at}
													onChange={(e) =>
														handleCreateReset(
															product.id,
															e.target.value
														)
													}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<Box
								sx={{ minWidth: 200, margin: 2 }}
								display="flex"
								gap={2}
								alignItems="center"
								justifyContent="flex-end"
							>
								<Button
									variant="contained"
									onClick={() => handleResetDate()}
								>
									統一日期
								</Button>
								<Button
									variant="contained"
									onClick={handleSaveClick}
									disabled={Number(progress) === 0 && loading ? true : false}
								>
									{Number(progress) === 0 && Number(progress) === 100
										? '正在送出...'
										: '送出'}
								</Button>
							</Box>
							{loading && (
								<ProgressBar
									value={progress}
									loading={loading}
									error={error}
									message={message}
								/>
							)}
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
};
