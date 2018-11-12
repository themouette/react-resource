import { popular } from './resources';
export const REDUCER_KEY = 'movies';

export const getState = state => state[REDUCER_KEY];
export const getMovies = state => getState(state).results;
export const getMovie = (state, { id }) =>
    getMovies(state).find(m => m.id === id);

export const moviesReducer = (state = { results: [] }, action) => {
    switch (action.type) {
        case popular.list.success:
            return action.response.data;

        case popular.get.success:
            return state;

        default:
            return state;
    }
};
