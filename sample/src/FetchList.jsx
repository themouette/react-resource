import { connect } from 'react-redux';
import { Component } from 'react';

/**
 * Fetch component
 */
class FetchList extends Component {
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
    const { resource, queryParams = '' } = props;
    return {
        isFetching: resource.list.isFetching(state, queryParams),
        isSuccess: resource.list.isSuccess(state, queryParams),
        isFailure: resource.list.isFailure(state, queryParams)
    };
}

function mapDispatchToProps(dispatch, props) {
    const { resource, queryParams = '' } = props;
    return {
        fetch() {
            return dispatch(resource.list(queryParams));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FetchList);
