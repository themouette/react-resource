// src/store.ts
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {
    ddReduxResourceReducer,
    ddResourceMiddleware,
    configure
} from 'dd-redux-resource';

import { REDUCER_KEY as MOVIES, moviesReducer } from './movies';

const reducer = combineReducers({
    ddReduxResourceReducer,
    [MOVIES]: moviesReducer
});

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose;

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk, ddResourceMiddleware))
);
store.dispatch(
    configure({
        backend: 'https://api.themoviedb.org/3',
        queryParams: {
            // moviedb api key
            api_key: '9516d8cf6ae933c1151ff9e5014bfc0d'
        },
        fetchOptions: {
            credentials: 'same-origin', // include, *same-origin, omit
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
    })
);

export { store };
