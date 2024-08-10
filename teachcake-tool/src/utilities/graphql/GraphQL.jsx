import retrieveHasuraData from '../api/api';

class GraphQL {
	constructor(query, variables, appId) {
		this.query = query;
		this.variables = variables;
		this.appId = appId;
		this.isReadOperation = this.determineOperationType(query);
	}
	determineOperationType(query) {
		const operationName = query.definitions[0].operation;
		return operationName === 'query';
	}
	async execute() {
		return await retrieveHasuraData(
			this.query,
			this.variables,
			this.appId,
			this.isReadOperation
		);
	}
}

export default GraphQL;
