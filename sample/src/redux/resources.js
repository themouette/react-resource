import { createResource } from 'dd-redux-resource';

export const popular = createResource('/movie/popular', {
    id: 'popularMovies',
    queryParams: {
        per_page: 20
    }
});
export const movie = createResource('/movie', {
    id: 'movies'
});
