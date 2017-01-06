react-graphql-redux
===================

This library allows you to use GraphQL to query your Redux store.
This library is in its early stages, feel free to send any PR.

Usage
-----

1- Create a GraphQL schema and resolver to match your data:

```js
const createGraph = store => {
	const schema = buildSchema(`
		type Query {
			hello( name: String ): String
		}
	`);

	const root = {
		hello: ({ name }) => `Hello ${name}!`
	};

	return { schema, root };
};
```

2- Wrap your React Root Component using `GraphProvider`

```js
import { GraphProvider } from 'react-graphql-redux';

const store = // create your Redux store
const { schema, root } = createGraph( store );

render(
	<GraphProvider store={ store } schema={ schema } root={ root }>
		<App />
	</GraphProvider>
);
```

3- Start using the `query` Higher Order Component to provide data as a prop to your components

```js
import { query } from 'react-graphql-redux';

const MyComponent = ({ data }) => {
	return (
		<div>{ data && data.hello }</div>
	);
};

export default query( '{ hello( name: "Riad" ) }' )( MyComponent );
```

Notice that now, components just **declares** the data they need without worrying how it's fetched and extracted from the state.

Using Redux Selectors in your Resolvers
---------------------------------------

In the example above, the function responsible of returning the data : `({ name }) => Hello ${name}!` is called **a resolver**. In this example, it just concats hello with the name arg.
But the main purpose of these resolvers will be to retrieve data from the state by calling Redux Selectors.

Say we have a `getTodos` selector which will retrieve todos from the store. The corresponding resolver could be:

```js
import { getTodos } from './selectors';

const createGraph = store => {
	const schema = buildSchema(`
		type Todo {
			id: Int
			text: String
			done: Boolean
		}

		type Query {
			todos: [Todo]
			// Other root query nodes
		}
	`);

	const root = {
		todos: () => {
			const state = store.getState();
			return getTodos(state);
		}
		// Other resolvers here
	};

	return { schema, root };
};
```

Fetch Data From the server
--------------------------

Resolvers are also responsible of triggering Redux action creators to fetch the desired data.

For example, if we have a`fetchTodos` action creator we should call to fetch the todos, and we want to refresh this data if it has not been fetched on the last 5 minutes, we could write:

```js
import { refreshWhenExpired } from 'react-graphql-redux';
import { fetchTodos } from './actions';

const createGraph = store => {
	// ....

	const root = {
		todos: () => {
			const timeout =  5 * 60 * 1000;
			const resolverIdentifier = 'fetch-todos';
			refreshWhenExpired(store, resolverIdentifier, {}, timeout, () => {
				store.dispatch(fetchTodos());
			});
			const state = store.getState();
			return getTodos(state);
		}
		// Other resolvers here
	};

// ...
```

But, to be able to use the refresh helpers provided by the library (like `refreshWhenExpired`), make sure to include the `graphReducer` to your store.

```js
import { graphReducer } from 'react-graphql-redux';

const myReduxReducer = combineReducers({
	graphqlResolvers: graphReducer,
	// Add your other reducers here
});
```

More
----

 * The query can be computed using component props (use a funciton instead of string for the first `query` arg)
 * You can use graphql variables in your queries (the second `arg` of `query`)
 * If you want to refresh the data on each new `query` used, it's possible
 * You can yse `GraphiQL` to test/explore your graph
