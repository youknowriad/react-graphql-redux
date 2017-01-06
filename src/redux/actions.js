export const GRAPH_RESOLVER_REQUEST_ADD = 'GRAPH_RESOLVER_REQUEST_ADD';
export const GRAPHQL_RESOLVER_REQUEST_CLEAR = 'GRAPHQL_RESOLVER_REQUEST_CLEAR';
export const GRAPH_RESOLVER_REQUEST_REMOVE = 'GRAPH_RESOLVER_REQUEST_REMOVE';

export function addRequest( uid, type, options = {} ) {
	const createdAt = Date.now();

	return {
		type: GRAPH_RESOLVER_REQUEST_ADD,
		payload: {
			uid,
			type,
			options,
			createdAt
		}
	};
}

export function removeRequest( uid, type, options = {} ) {
	return {
		type: GRAPH_RESOLVER_REQUEST_REMOVE,
		payload: {
			uid,
			type,
			options
		}
	};
}

export function clearRequests( uid ) {
	return {
		type: GRAPHQL_RESOLVER_REQUEST_CLEAR,
		payload: uid
	};
}
