import { filter, omit } from 'lodash';
import { GRAPH_RESOLVER_REQUEST_ADD, GRAPH_RESOLVER_REQUEST_REMOVE, GRAPHQL_RESOLVER_REQUEST_CLEAR } from './actions';

const handleAdd = ( state, { payload: { uid, type, options, createdAt } } ) => {
	const optionsSerialization = JSON.stringify( options );
	return {
		...state,
		[ uid ]: [
			...( state[ uid ] ? state[ uid ] : [] ),
			{ type, options: optionsSerialization, createdAt }
		]
	};
}

const handleRemove = ( state, { payload: { uid, type, options } } ) => {
	const optionsSerialization = JSON.stringify( options );
	return {
		...state,
		[ uid ]: filter( state[ uid ], request => {
			return request.type !== type || request.options !== optionsSerialization;
		} )
	};
};

const handleClear = ( state, { payload: uid } ) => {
	return omit( state, [ uid ] );
};

const reducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case  GRAPH_RESOLVER_REQUEST_ADD:
			return handleAdd( state, action );
		case  GRAPH_RESOLVER_REQUEST_REMOVE:
			return handleRemove( state, action );
		case  GRAPHQL_RESOLVER_REQUEST_CLEAR:
			return handleClear( state, action );
		default:
			return state;
	}
}

export default reducer;
