import React, { Component } from 'react';
import { connect } from 'react-redux';

import { popular } from './redux/resources';
import { getMovie } from './redux/movies';

/**
 * Detail component
 */
export class Detail extends Component {
    componentDidMount() {
        this.props.get(this.props.selected);
    }

    render() {
        return (
            <div>
                <ul>
                    <li>
                        isFetching: {this.props.isFetching ? 'true' : 'false'}
                    </li>
                    <li>
                        isSuccess: {this.props.isSuccess ? 'true' : 'false'}
                    </li>
                    <li>
                        isFailure: {this.props.isFailure ? 'true' : 'false'}
                    </li>
                </ul>
                <button onClick={this.props.close}>X</button>
                {this.props.isSuccess ? (
                    <>
                        <h1>{this.props.movie.title}</h1>
                        <p>{this.props.movie.overview}</p>
                    </>
                ) : this.props.isLoading ? (
                    <p>Loading</p>
                ) : this.props.isFailure ? (
                    <p>Failure</p>
                ) : (
                    <p>Loading</p>
                )}
            </div>
        );
    }
}

const qs = 'api_key=9516d8cf6ae933c1151ff9e5014bfc0d';
const mapStateToProps = (state, { selected }) => ({
    isFetching: popular.get.isFetching(state, selected, qs),
    isSuccess: popular.get.isSuccess(state, selected, qs),
    isFailure: popular.get.isFailure(state, selected, qs),
    movie: getMovie(state, { id: selected })
});
const mapDispatchToProps = dispatch => ({
    get: id => {
        return dispatch(popular.get(id, qs));
    }
});

export const DetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Detail);
