import { AnyAction, Reducer } from 'redux';

import {
    ActionTypes,
    ActionConfigure,
    ConfigState,
    FullState,
    MiddlewareConfiguration,
    REDUCER_KEY
} from './types';

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
    const { backend: stateBackend } = getConfig(state);
    const backend = props.backend || stateBackend;

    const separator =
        backend.charAt(backend.length - 1) === '/' ||
        props.path.charAt(0) === '/'
            ? ''
            : '/';
    return `${backend || props.backend}${separator}${props.path}`;
};

/* Reducer */

const DEFAULT_CONFIG_STATE = {
    backend: '',
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
                fetchOptions: {
                    ...state.fetchOptions,
                    ...(configureAction.payload.fetchOptions || {})
                }
            };

        default:
            return state;
    }
};
