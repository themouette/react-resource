import React, { Component } from 'react';
import { connect } from 'react-redux';

import { popular } from './redux/resources';
import { getMovies } from './redux/movies';
import { DetailContainer } from './Detail';

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

    loadList = () => {
        this.props.list();
    }

    componentDidMount() {
        this.loadList();
    }

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
            <>
                <button onClick={this.loadList}>Reload</button>
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
                                onClick={() => this.selectMovie(movie.id)}
                            >
                                <img src={this.getMoviePosterUrl(movie)} />
                                {movie.title}
                            </li>
                        ))}
                    </ul>
                )}
            </>
        );
    }
}

const qs = 'api_key=9516d8cf6ae933c1151ff9e5014bfc0d';

const mapStateToProps = state => ({
    isFetching: popular.list.isFetching(state, qs),
    isSuccess: popular.list.isSuccess(state, qs),
    isFailure: popular.list.isFailure(state, qs),
    movies: getMovies(state)
});
const mapDispatchToProps = dispatch => ({
    list: () => {
        return dispatch(popular.list(qs));
    }
});

export const TestContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Test);
