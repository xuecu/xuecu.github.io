import React from 'react';
import { updateProgress } from '../progress-bar/progress-bar.components';
import CollapsibleTable from '../collapsible-table/collapsible-table.components';
import { ContractsRow } from '../collapsible-table/row.components';
import { useMember } from '../../contexts/member.contexts';
import { useMenu } from '../../contexts/menu.contexts';
import { dateAddYear, dateToYMD, diffDays } from '../../utilities/function/dayjs.func';
import {
	superNote,
	updateOrderProduct,
	updateCoinLog,
	updateCouponPlan,
} from '../../utilities/function/mutations.func';

const Extension = () => {
	const { memberInfo } = useMember();
	const { brand } = useMenu();
	const title = ['訂單編號', '簽約日期', '姓名', 'Email'];
	const handleSave = async (contractId, handleState) => {
		const { endDate, setLoading, setProgress, error, setError, setMessage } = handleState;
		setLoading(true);
		setProgress(0);
		setError(null);
		setMessage('');
		const constracts = memberInfo.contracts;
		let task = [];
		const resetData = {};
		for (const contract of constracts) {
			if (contract.id === contractId) {
				const resetAt = dateToYMD(endDate);
				const { orderProducts, coinLogs, coupons } = contract.values;

				resetData.orderProducts = orderProducts.map((product) => {
					if (product.product_id.startsWith('ProgramPackagePlan') && brand === 'xuemi') {
						return {
							...product,
							reset_at: dateAddYear(resetAt),
						};
					}
					if (product.product_id.startsWith('ProjectPlan')) {
						return {
							...product,
							reset_at: resetAt,
						};
					}
					if (product.product_id.startsWith('Card')) {
						return {
							...product,
							reset_at: resetAt,
						};
					}
					return { ...product };
				});
				if (brand === 'xuemi') {
					resetData.coinLogs = coinLogs.map((coin) => ({
						...coin,
						reset_at: resetAt,
					}));
					coupons.forEach((coupon) => {
						if (Object.hasOwn(coupon.coupon_code.data, 'coupon_plan_id'))
							resetData.couponPlan = {
								id: coupon.coupon_code.data.coupon_plan_id,
								reset_at: resetAt,
							};
					});
				}
			}
		}
		const keys = Object.keys(resetData);
		for (const key of keys) {
			if (key === 'orderProducts')
				resetData[key].forEach(
					(product) => product.reset_at && task.push(updateOrderProduct(product, brand))
				);
			if (key === 'couponPlan') task.push(updateCouponPlan(resetData[key], brand));
			if (key === 'coinLogs')
				resetData[key].forEach((coin) => task.push(updateCoinLog(coin, brand)));
		}
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
				const descriptionGapDate = `展延天數： ${diffDays(
					constracts.server_date,
					endDate
				)} 日`;
				const descriptionServerBeforeTime = `修改前服務日期： ${dateToYMD(
					constracts.server_date
				)}`;
				const descriptionServerAfterTime = `修改後服務日期： ${dateToYMD(endDate)}`;
				const description = ` ----------\n${descriptionGapDate}\n${descriptionServerBeforeTime}\n${descriptionServerAfterTime}\n----------
					`;
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
	};
	const controller = {
		showDate: false,
		onSave: handleSave,
	};
	return (
		<CollapsibleTable
			title={title}
			datas={memberInfo.contracts}
			renderRow={(contract, index) => (
				<ContractsRow
					key={index}
					data={contract}
					{...controller}
				/>
			)}
		/>
	);
};

export default Extension;
