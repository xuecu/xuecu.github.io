import {
	UPDATE_ORDER_PRODUCT,
	UPDATE_COIN_LOG,
	UPDATE_COUPON_PLAN,
	SUPER_NOTE,
} from '../graphql/mutations';
import GraphQL from '../graphql/GraphQL';
import { dateToLastTimeISOString, dateToISOString } from './dayjs.func';

export const updateOrderProduct = async (product, appId) => {
	const endedAt = dateToLastTimeISOString(product.reset_at);
	const graphqlQuery = new GraphQL(
		UPDATE_ORDER_PRODUCT,
		{
			id: product.id,
			endedAt: endedAt,
		},
		appId
	);
	try {
		const result = await graphqlQuery.execute(); // 执行 GraphQL 请求
		console.log(
			`已更新的 OrderProduct ${product.id}:`,
			result.data.update_order_product.returning
		);
	} catch (e) {
		console.error(`更新的 OrderProduct ${product.id} 出錯:`, e);
		throw e;
	}
};

export const updateCoinLog = async (coinLog, appId) => {
	const endedAt = dateToLastTimeISOString(coinLog.reset_at);
	const graphqlQuery = new GraphQL(
		UPDATE_COIN_LOG,
		{
			id: coinLog.id,
			endedAt: endedAt,
		},
		appId
	);
	try {
		const result = await graphqlQuery.execute(); // 执行 GraphQL 请求
		console.log(`已更新的 Coin Log ${coinLog.id}:`, result.data.update_coin_log.returning);
	} catch (e) {
		console.e(`更新的 Coin Log ${coinLog.id} 出錯:`, e);
		throw e;
	}
};

export const updateCouponPlan = async (couponPlan, appId) => {
	const endedAt = dateToLastTimeISOString(couponPlan.reset_at);
	const graphqlQuery = new GraphQL(
		UPDATE_COUPON_PLAN,
		{
			id: couponPlan.id,
			endedAt: endedAt,
		},
		appId
	);
	try {
		const result = await graphqlQuery.execute(); // 执行 GraphQL 请求
		console.log('已更新的 Coupon Plan:', result.data.update_coupon_plan.returning);
	} catch (error) {
		console.error(`更新的 Coupon Plan ${couponPlan.id} 出錯:`, error);
	}
};

export const superNote = async (noteDoc, appId) => {
	const createAt = dateToISOString(noteDoc.create_at);
	const graphqlQuery = new GraphQL(
		SUPER_NOTE,
		{
			createdAt: createAt,
			description: noteDoc.description,
			memberId: noteDoc.member_id,
			authorId: noteDoc.author_id,
		},
		appId
	);
	try {
		const result = await graphqlQuery.execute(); // 执行 GraphQL 请求
		console.log(
			`已紀錄 Super Note 於 ${noteDoc.member_id} :`,
			result.data.insert_member_note.returning
		);
	} catch (error) {
		console.error(`更新的 Super Note ${noteDoc.member_id} 出錯:`, error);
	}
};
