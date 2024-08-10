import {
	GET_MEMBER_ID_BY_EMAIL,
	GET_MEMBER_CONTRACTS_BY_MEMBER_ID,
	GET_ORDER_PRODUCT_BY_ORDER_ID,
	GET_MEMBER_ORDER_LOGS_BY_EMAIL,
	GET_COIN_LOG_BY_COIN_LOG_ID,
	GET_COUPON_PLAN_BY_COUPON_PLAN_ID,
} from '../graphql/queries';

import GraphQL from '../graphql/GraphQL';

export const GetMemberIdByEmail = async (email, appId) => {
	const query = GET_MEMBER_ID_BY_EMAIL;
	const variables = { email: email };
	const connection = new GraphQL(query, variables, appId);
	try {
		const response = await connection.execute();
		return response.data.member.find((m) => m);
	} catch (e) {
		console.error(`讀取 member id 失敗。${e}`);
		throw e;
	}
};

export const getMemberContractsByMemberId = async (memberId, appId) => {
	const query = GET_MEMBER_CONTRACTS_BY_MEMBER_ID;
	const variables = { memberId: memberId.toString() };
	const connection = new GraphQL(query, variables, appId);
	try {
		const response = await connection.execute();
		return response.data.member_contract;
	} catch (e) {
		console.error(`讀取 member contract 失敗。${e}`);
		throw e;
	}
};

export const getOrderProductByOrderId = async (orderId, appId) => {
	const query = GET_ORDER_PRODUCT_BY_ORDER_ID;
	const variables = { orderId: orderId.toString() };
	const connection = new GraphQL(query, variables, appId);
	try {
		const response = await connection.execute();
		return response.data.order_product;
	} catch (e) {
		console.error(`讀取 Order Product 失敗${e}`);
		throw e;
	}
};

export const getMemberOrderLogByEmail = async (mail, appId) => {
	const query = GET_MEMBER_ORDER_LOGS_BY_EMAIL;
	const variables = { mail: mail };
	const connection = new GraphQL(query, variables, appId);
	try {
		const response = await connection.execute();
		return response.data.order_log;
	} catch (e) {
		console.error(`讀取 order log 失敗 ${e}`);
		throw e;
	}
};

export const getCoinLogByCoinLogId = async (coinLogId, appId) => {
	const query = GET_COIN_LOG_BY_COIN_LOG_ID;
	const variables = { id: coinLogId };
	const connection = new GraphQL(query, variables, appId);
	try {
		const response = await connection.execute();
		return response;
	} catch (e) {
		console.error(`讀取 coin log 失敗 ${e}`);
		throw e;
	}
};

export const getCouponPlanByCouponPlanId = async (couponPlanId, appId) => {
	const query = GET_COUPON_PLAN_BY_COUPON_PLAN_ID;
	const variables = { id: couponPlanId };
	const connection = new GraphQL(query, variables, appId);
	try {
		const response = await connection.execute();
		return response;
	} catch (e) {
		console.error(`讀取 coupon plan 失敗 ${e}`);
		throw e;
	}
};
