import React, { Component } from 'react';
import { connect } from 'react-redux';

import { movie } from './redux/resources';
import { getMovie } from './redux/movies';
import Fetch from './Fetch';

/**
 * Detail component
 */
export class Detail extends Component {
    render() {
        return (
            <Fetch resource={movie} path={`/${this.props.selected}`}>
                {({ isFetching, isSuccess, isFailure, fetch }) => (
                    <div>
                        <ul>
                            <li>isFetching: {isFetching ? 'true' : 'false'}</li>
                            <li>isSuccess: {isSuccess ? 'true' : 'false'}</li>
                            <li>isFailure: {isFailure ? 'true' : 'false'}</li>
                        </ul>
                        <button onClick={this.props.close}>X</button>
                        {isSuccess ? (
                            <>
                                <h1>{this.props.movie.title}</h1>
                                <p>{this.props.movie.overview}</p>
                            </>
                        ) : this.props.isLoading ? (
                            <p>Loading</p>
                        ) : this.props.isFailure ? (
                            <p>Failure <button onClick={fetch}>Retry</button></p>
                        ) : (
                            <p>Loading</p>
                        )}
                    </div>
                )}
            </Fetch>
        );
    }
}

const mapStateToProps = (state, { selected }) => ({
    movie: getMovie(state, { id: selected })
});

export const DetailContainer = connect(mapStateToProps)(Detail);
