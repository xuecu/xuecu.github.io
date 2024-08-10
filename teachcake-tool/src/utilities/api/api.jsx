import axios from 'axios';
import brands from '../../brands';

const app_key = brands.reduce((acc, brand) => {
	acc[brand.id] = {
		clientId: brand.clientId,
		key: brand.clientKey,
	};
	return acc;
}, {});

async function retrieveAuthToken(appId) {
	const payload = { ...app_key[appId], permission: [] };
	console.log('Payload for auth request:', JSON.stringify(payload));
	let authToken = null;

	try {
		const response = await axios.post(process.env.REACT_APP_API_BASE_URL, payload, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data = response.data;

		if (response.status !== 200) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		if (data && data.result && data.result.authToken) {
			authToken = data.result.authToken;
		} else {
			throw new Error('Failed to retrieve authToken');
		}
	} catch (error) {
		console.error('Error fetching authToken:', error);
		throw error;
	}

	return authToken;
}

async function retrieveHasuraData(query, variables, appId, isReadOperation) {
	const authToken = await retrieveAuthToken(appId);
	const endpoint = isReadOperation
		? process.env.REACT_APP_GRAPHQL_READPOINT
		: process.env.REACT_APP_GRAPHQL_ENDPOINT;

	try {
		const response = await axios.post(
			endpoint,
			{
				query: query.loc.source.body,
				variables: variables,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			}
		);

		if (response.status !== 200) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
}

export default retrieveHasuraData;
