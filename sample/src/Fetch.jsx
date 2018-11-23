import { connect } from 'react-redux';
import { Component } from 'react';

/**
 * Fetch component
 */
class Fetch extends Component {
    componentDidMount() {
        const { isFetching, isSuccess, isFailure } = this.props;

        if (!isFetching && (isFailure || !isSuccess)) {
            this.props.fetch();
        }
    }

    render() {
        const { isFetching, isSuccess, isFailure, fetch } = this.props;

        return this.props.children({ isFetching, isSuccess, isFailure, fetch });
    }
}

function mapStateToProps(state, props) {
    const { resource, queryParams = '', path = '' } = props;
    return {
        isFetching: resource.get.isFetching(state, path, queryParams),
        isSuccess: resource.get.isSuccess(state, path, queryParams),
        isFailure: resource.get.isFailure(state, path, queryParams)
    };
}

function mapDispatchToProps(dispatch, props) {
    const { resource, queryParams = '', path = '' } = props;
    return {
        fetch() {
            return dispatch(resource.get(path, queryParams));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Fetch);
