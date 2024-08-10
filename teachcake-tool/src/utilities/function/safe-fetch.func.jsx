export const safeFetch = async (fetchFunction, errorMessage) => {
	try {
		const result = await fetchFunction();
		if (!result) {
			throw new Error(errorMessage);
		}
		return result;
	} catch (error) {
		throw new Error(errorMessage);
	}
};
