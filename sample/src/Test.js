import React, { Component } from 'react';
import { connect } from 'react-redux';

import { popular } from './redux/resources';
import { getMovies } from './redux/movies';
import { DetailContainer } from './Detail';
import FetchList from './FetchList';

/**
 * Test component
 */
class Test extends Component {
    state = { selected: null };

    selectMovie = selected => {
        this.setState({ selected });
    };

    closeDetail = () => {
        this.setState({ selected: null });
    };

    getMoviePosterUrl(movie) {
        if (!movie.poster_path) {
            return 'https://via.placeholder.com/154';
        }
        if (movie.adult) {
            return 'https://via.placeholder.com/154?text=Adult+Only';
        }
        return `https://image.tmdb.org/t/p/w154${movie.poster_path}`;
    }

    render() {
        return (
            <FetchList resource={popular}>
                {({ isFetching, isSuccess, isFailure, fetch }) => (
                    <>
                        <button onClick={fetch}>Reload</button>
                        <ul>
                            <li>isFetching: {isFetching ? 'true' : 'false'}</li>
                            <li>isSuccess: {isSuccess ? 'true' : 'false'}</li>
                            <li>isFailure: {isFailure ? 'true' : 'false'}</li>
                        </ul>
                        {this.state.selected ? (
                            <DetailContainer
                                selected={this.state.selected}
                                close={this.closeDetail}
                            />
                        ) : (
                            <ul>
                                {this.props.movies.map(movie => (
                                    <li
                                        key={movie.id}
                                        onClick={() =>
                                            this.selectMovie(movie.id)
                                        }
                                    >
                                        <img
                                            alt=""
                                            src={this.getMoviePosterUrl(movie)}
                                        />
                                        {movie.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </FetchList>
        );
    }
}

const mapStateToProps = state => ({
    movies: getMovies(state)
});

export const TestContainer = connect(mapStateToProps)(Test);
