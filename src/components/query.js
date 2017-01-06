import React, { Component, PropTypes } from 'react';
import { isString, uniqueId, throttle } from 'lodash';
import { graphql } from 'graphql';
import { quickGraphql, parse } from '../quick-graphql';
import { makePromiseCancelable } from '../utils/promises';
import { clearRequests } from '../redux/actions';

const THROTTLE_DELAY = 50;

const query = ( mapPropsToQuery, mapPropsToVariables = () => ( {} ) ) => ( WrappedComponent ) => {
	return class GraphQueryComponent extends Component {
		state = {
			data: null,
			errors: null
		};

		uid = uniqueId();

		static contextTypes = {
			graph: PropTypes.object
		};

		constructor( props, context ) {
			super( props, context );
			this.buildQuery( props );
		}

		componentDidMount() {
			const throttledRequest = throttle( this.request, THROTTLE_DELAY, { leading: true } );
			this.unsubscribe = this.context.graph.store.subscribe( throttledRequest );
			this.request();
		}

		componentWillUnmount() {
			this.cancelRequest();
			this.unsubscribe && this.unsubscribe();
			this.context.graph.store.dispatch( clearRequests( this.uid ) );
		}

		componentWillReceiveProps( newProps ) {
			this.buildQuery( newProps );
			this.request();
		}

		buildQuery( props ) {
			if ( isString( mapPropsToQuery ) ) {
				this.query = mapPropsToQuery;
			} else {
				this.query = mapPropsToQuery( props );
			}
			this.variables = mapPropsToVariables( props );
			this.parsedQuery = parse( this.query, this.variables );
		}

		cancelRequest() {
			this.cancelRequestPromise && this.cancelRequestPromise();
		}

		request = () => {
			this.cancelRequest();
			const cancelablePromise = makePromiseCancelable( this.triggerGraphRequest() );
			this.cancelRequestPromise = cancelablePromise.cancel;
			cancelablePromise.promise
				.then( results => {
					this.setState( results );
					this.cancelRequestPromise = false;
				} )
				.catch( () => {} ); // avoid console warnings
		};

		triggerGraphRequest() {
			if ( process.env.NODE_ENV === 'development' ) {
				return graphql( this.context.graph.schema, this.query, this.context.graph.root, { uid: this.uid }, this.variables );
			}

			return quickGraphql( this.parsedQuery, this.context.graph.root, { uid: this.uid } );
		}

		render() {
			return (
				<WrappedComponent { ...this.props } { ...this.state } />
			);
		}
	};
};

export default query;
