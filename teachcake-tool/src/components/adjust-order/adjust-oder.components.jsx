import React from 'react';
import { updateProgress } from '../progress-bar/progress-bar.components';
import CollapsibleTable from '../collapsible-table/collapsible-table.components';
import { ProductsRow } from '../collapsible-table/row.components';
import { useMember } from '../../contexts/member.contexts';
import { useMenu } from '../../contexts/menu.contexts';
import { superNote, updateOrderProduct } from '../../utilities/function/mutations.func';

const AdjustOrder = () => {
	const { memberInfo } = useMember();
	const { brand } = useMenu();
	const title = ['訂單編號', '日期', '狀態'];
	const handleSave = async (handleState) => {
		const { setLoading, setProgress, error, setError, setMessage, orderProduct } = handleState;

		const resetAt = orderProduct.find((product) => Object.hasOwn(product, 'reset_at'));
		if (resetAt && resetAt.reset_at) {
			setLoading(true);
			setProgress(0);
			setError(null);
			setMessage('');
			// const constracts = memberInfo.contracts;
			const task = [];
			const resetData = [];

			for (const product of orderProduct)
				if (Object.hasOwn(product, 'reset_at')) resetData.push(product);

			for (const data of resetData) task.push(updateOrderProduct(data, brand));

			console.log('task : ', task);
			console.log('resetData : ', resetData);
			try {
				for (let i = 0; i < task.length; i++) {
					try {
						setMessage(`任務正在處理中 ${i + 1} / ${task.length}`);
						await task[i];
						updateProgress(setProgress, i + 1, task.length);
					} catch (Error) {
						console.error('執行任務時出錯:', Error);
						setError(`任務 ${i + 1} 出現錯誤：${Error.message || Error}`);
						break;
					}
				}
			} finally {
				setLoading(false);
				if (!error) {
					setMessage('所有任務已完成');
					const now = new Date();
					const descriptionProducts = `${resetData.map((product) => {
						return `***\n修改訂單 ID：${product.id}\n修改訂單名稱：${product.name}\n修改日期：${product.reset_at}\n***\n`;
					})}`;
					const description = `----------\n${descriptionProducts}----------\n`;
					const noteDoc = {
						create_at: now,
						description: description,
						member_id: memberInfo.member.id,
						author_id: memberInfo.member.id,
					};
					try {
						await superNote(noteDoc, brand);
					} catch (e) {
						console.error('執行後台紀錄時出錯:', e);
						throw e;
					}
				}
			}
		} else alert('請輸入一個時間!');
	};
	const onResetDate = (handleState) => {
		const { orderProduct, setOrderProduct } = handleState;
		const resetAt = orderProduct.find((product) => Object.hasOwn(product, 'reset_at'));
		const newOrderProduct = [];
		if (resetAt && resetAt.reset_at) {
			for (const product of orderProduct)
				newOrderProduct.push({ ...product, reset_at: resetAt.reset_at });
			setOrderProduct(newOrderProduct);
		} else alert('請輸入一個時間!');
	};
	const createResetDate = (orderProductId, value, handleState) => {
		const { orderProduct, setOrderProduct } = handleState;
		const newOrderProduct = [];
		for (const product of orderProduct) {
			if (product.id === orderProductId)
				newOrderProduct.push({ ...product, reset_at: value });
			else newOrderProduct.push({ ...product });
		}
		setOrderProduct(newOrderProduct);
	};
	const controller = {
		showDate: false,
		onSave: handleSave,
		onResetDate: onResetDate,
		createResetDate: createResetDate,
	};
	return (
		<CollapsibleTable
			title={title}
			datas={memberInfo.orderLogs}
			renderRow={(orderProduct, index) => (
				<ProductsRow
					key={index}
					data={orderProduct}
					{...controller}
				/>
			)}
		/>
	);
};

export default AdjustOrder;
