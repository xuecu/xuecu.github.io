import React, { Fragment, useState } from 'react';
import { Box, Button } from '@mui/material';
import Extension from '../extension/extension.components';
import Leave from '../leave/leave.components';
import AdjustOrder from '../adjust-order/adjust-oder.components';
import FormControlComponents from './from-control.components';
import ProgressBar, { updateProgress } from '../progress-bar/progress-bar.components';
import { safeFetch } from '../../utilities/function/safe-fetch.func';
import { useMenu } from '../../contexts/menu.contexts';
import { useMember } from '../../contexts/member.contexts';
import {
	GetMemberIdByEmail,
	getMemberContractsByMemberId,
	getOrderProductByOrderId,
	getMemberOrderLogByEmail,
} from '../../utilities/function/queries.func';

export default function Menu() {
	const { menus, page, brand, email } = useMenu();
	const { setMemberInfo, handlerReset } = useMember();
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState('');

	const handleFetchData = async () => {
		if (!brand || !page || !email) {
			alert('歐歐~有欄位沒填');
			return;
		}
		setLoading(true);
		setProgress(0);
		setError(null);
		setMessage('');
		setMemberInfo({});
		try {
			const info = {};
			const tasks = [];

			// 取 Member ID
			info.member = await safeFetch(
				() => GetMemberIdByEmail(email, brand),
				'Member ID not found'
			);
			updateProgress(setProgress, 1, 4);

			// 取 Member Contracts
			info.contracts = await safeFetch(
				() => getMemberContractsByMemberId(info.member.id, brand),
				'Member Contracts not found'
			);
			updateProgress(setProgress, 2, 4);

			// 取 Order Products
			for (const contract of info.contracts) {
				tasks.push(
					safeFetch(
						() => getOrderProductByOrderId(contract.values.orderId, brand),
						`${contract.values.orderId} Order Id not found`
					)
				);
			}

			const orderProducts = await Promise.all(tasks);
			orderProducts.forEach((product, index) => {
				info.contracts[index].values.orderProducts = product;
				updateProgress(setProgress, 2 + (index + 1) / tasks.length, 4);
			});

			// 取 Order Logs
			info.orderLogs = await safeFetch(
				() => getMemberOrderLogByEmail(email, brand),
				'Order Logs not found'
			);
			updateProgress(setProgress, 4, 4);

			setMemberInfo(info);
			setMessage('所有任務已完成');
		} catch (error) {
			console.error('執行任務時出錯:', error);
			setError(`出現錯誤：${error.message || error}`);
			alert(`查無此學員的${email}在${brand}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Fragment>
			<Box
				sx={{ minWidth: 120 }}
				display="flex"
				alignItems="center"
			>
				<FormControlComponents menus={menus} />
				<Box sx={{ p: 2 }}>
					<Button
						onClick={handleFetchData}
						variant="contained"
					>
						確認
					</Button>
				</Box>
				<Box sx={{ p: 2 }}>
					<Button
						onClick={handlerReset}
						variant="outlined"
					>
						清除
					</Button>
				</Box>
			</Box>
			{loading && (
				<ProgressBar
					value={progress}
					loading={loading}
					error={error}
					message={message}
				></ProgressBar>
			)}
			<Box>
				{page === 'adjustOrder' && <AdjustOrder />}
				{page === 'leave' && <Leave />}
				{page === 'extension' && <Extension />}
			</Box>
		</Fragment>
	);
}
