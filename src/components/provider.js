import { Component, PropTypes, Children } from 'react';

export default class GraphProvider extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
		schema: PropTypes.object.isRequired,
		root: PropTypes.object.isRequired,
		children: PropTypes.element.isRequired
	};

	static childContextTypes = {
		graph: PropTypes.object.isRequired
	};

	getChildContext() {
		return { graph: this.graph };
	}

	constructor( props, context ) {
		super( props, context );
		const { store, root, schema } = props;
		this.graph = { store, root, schema };
	}

	render() {
		return Children.only( this.props.children );
	}
}
