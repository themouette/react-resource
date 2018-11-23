import { AnyAction, Reducer } from 'redux';

import {
    ActionTypes,
    ActionConfigure,
    ConfigState,
    FullState,
    MiddlewareConfiguration,
    QueryString,
    REDUCER_KEY
} from './types';

import { combinePathAndQuery, combineQueries } from './queryString';

/* Actions */

/**
 * Configure the middleware behavior
 * This can be done as often as required.
 */
export const configure = (
    configuration: Partial<MiddlewareConfiguration>
): ActionConfigure => ({
    type: ActionTypes.CONFIGURE,
    payload: configuration
});

/* selectors */

export const getConfig = (state: FullState) => state[REDUCER_KEY].config;
/**
 * Returns an object ready to pass to a fetch call
 */
export const getRequestConfig = (
    state: FullState,
    props: Partial<MiddlewareConfiguration>
): RequestInit => {
    const { fetchOptions } = getConfig(state);
    return {
        ...fetchOptions,
        ...(props.fetchOptions || {})
    };
};
/**
 * Returns fully qualified URL for request
 */
export const getRequestQualifiedUrl = (
    state: FullState,
    props: { backend?: string; path: string }
): string => {
    const { backend: stateBackend, queryParams: stateQueryParams } = getConfig(
        state
    );
    const backend = props.backend || stateBackend;
    const [path, queryString] = props.path.split('?');
    const queryParams = combineQueries(stateQueryParams, queryString);

    const separator =
        backend.charAt(backend.length - 1) === '/' ||
        props.path.charAt(0) === '/'
            ? ''
            : '/';
    return `${backend || props.backend}${separator}${combinePathAndQuery(
        path,
        queryParams
    )}`;
};

/* Reducer */

const DEFAULT_CONFIG_STATE = {
    backend: '',
    queryParams: '',
    fetchOptions: {}
};
export const configReducer: Reducer<ConfigState, AnyAction> = (
    state = DEFAULT_CONFIG_STATE,
    action
) => {
    switch (action.type) {
        case ActionTypes.CONFIGURE:
            const configureAction = action as ActionConfigure;
            return {
                backend: configureAction.payload.backend || state.backend,
                queryParams:
                    'queryParams' in configureAction.payload
                        ? configureAction.payload.queryParams
                        : state.queryParams,
                fetchOptions: {
                    ...state.fetchOptions,
                    ...(configureAction.payload.fetchOptions || {})
                }
            };

        default:
            return state;
    }
};
