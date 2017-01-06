import React, { Component, PropTypes } from 'react';
import GraphiQL from 'graphiql';
import { graphql } from 'graphql';

export default class GraphiQLWrapper extends Component {
	static contextTypes = {
		graph: PropTypes.object.isRequired
	};

	fetch = ( { query, variables } ) => {
		return graphql( this.context.graph.schema, query, this.context.graph.root, { uid: this.uid }, variables );
	};

	render() {
		return (
			<GraphiQL fetcher={ this.fetch } />
		);
	}
}
