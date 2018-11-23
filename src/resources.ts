import { AnyAction, Reducer } from 'redux';

import {
    ActionConfigure,
    ActionFetch,
    ActionFetchStart,
    ActionFetchSuccess,
    ActionFetchFailure,
    ActionFetchLifecycle,
    ActionTypes,
    ResourceState,
    ResourceLifecycle,
    FetchResponse,
    FullState,
    HttpMethod,
    MiddlewareConfiguration,
    QueryString,
    QueryStringParam,
    REDUCER_KEY
} from './types';

import { stringifyQuery, combinePathAndQuery } from './queryString';

/* ======================== */
/* Selectors                */
/* ======================== */

export const getResource = (state: FullState) => state[REDUCER_KEY].resources;
export const getIsResourceFetching = (
    state: FullState,
    { requestId }: { requestId: string }
): boolean => getResource(state).isFetching.includes(requestId);
export const getIsResourceSuccess = (
    state: FullState,
    { requestId }: { requestId: string }
): boolean => getResource(state).isSuccess.includes(requestId);
export const getIsResourceFailure = (
    state: FullState,
    { requestId }: { requestId: string }
): boolean => getResource(state).isFailure.includes(requestId);

/* ======================== */
/* Actions                  */
/* ======================== */

export const fetchStart = <T>(
    requestId: string,
    type: T
): ActionFetchStart<T> => ({
    type,
    ddReduxResourceLifecycle: {
        lifecycle: ResourceLifecycle.START,
        requestId
    }
});
export const fetchSuccess = <T, R>(
    requestId: string,
    type: T,
    response: FetchResponse<R>
): ActionFetchSuccess<T, R> => ({
    type,
    ddReduxResourceLifecycle: {
        lifecycle: ResourceLifecycle.SUCCESS,
        requestId
    },
    response
});
export const fetchFailure = <T, R>(
    requestId: string,
    type: T,
    response: FetchResponse<R>
): ActionFetchFailure<T, R> => ({
    type,
    ddReduxResourceLifecycle: {
        lifecycle: ResourceLifecycle.FAILURE,
        requestId
    },
    response
});

const fetchAction = (
    method: HttpMethod,
    path: string,
    fetchOptions: Partial<RequestInit> = {},
    options: Partial<MiddlewareConfiguration> = {}
): ActionFetch => ({
    type: ActionTypes.FETCH,
    payload: {
        method,
        path,
        backend: options.backend,
        fetchOptions: fetchOptions
    }
});

/**
 * Tells the middleware to perform a raw GET request.
 */
export const GET = (
    path: string = '',
    query: QueryString,
    fetchOptions: Partial<RequestInit> = {},
    options: Partial<MiddlewareConfiguration> = {}
) =>
    fetchAction(
        HttpMethod.GET,
        combinePathAndQuery(path, stringifyQuery(query)),
        fetchOptions,
        options
    );

/* ======================== */
/* Reducers                 */
/* ======================== */

// remove the first occurence of needle in haystack
const removeOne = <T>(haystack: T[], needle: T): T[] => {
    const position = haystack.indexOf(needle);
    if (position < 0) return haystack;

    return [...haystack.slice(0, position), ...haystack.slice(position + 1)];
};
// Append needle to haystack
const appendOne = <T>(haystack: T[], needle: T): T[] => haystack.concat(needle);
// Remove all occurences of needle in haystack
const removeAll = <T>(haystack: T[], needle: T): T[] =>
    haystack.filter(e => e === needle);

export const resourcesReducer: Reducer<ResourceState, AnyAction> = (
    state = { isFetching: [], isSuccess: [], isFailure: [] },
    action
) => {
    if (!('ddReduxResourceLifecycle' in action)) {
        // In case this is not a lifecycle action, no need to bother.
        return state;
    }

    const {
        ddReduxResourceLifecycle: { lifecycle, requestId }
    } = action as ActionFetchLifecycle<any, any>;

    switch (lifecycle) {
        case ResourceLifecycle.START:
            // we just need to happen the request id to isFetching
            return {
                ...state,
                isFetching: appendOne(state.isFetching, requestId)
            };

        case ResourceLifecycle.SUCCESS:
            // we need to happen the request id to isSuccess and remove one from
            // isFetching
            // In case there were a failure for the same request earlier, we
            // should remove all occurences to
            return {
                ...state,
                isFetching: removeOne(state.isFetching, requestId),
                isSuccess: appendOne(state.isSuccess, requestId),
                isFailure: removeAll(state.isFailure, requestId)
            };

        case ResourceLifecycle.FAILURE:
            // we need to happen the request id to isSuccess and remove one from
            // isFetching
            // In case there were a failure for the same request earlier, we
            // should remove all occurences to
            return {
                ...state,
                isFetching: removeOne(state.isFetching, requestId),
                isSuccess: removeAll(state.isSuccess, requestId),
                isFailure: appendOne(state.isFailure, requestId)
            };
    }

    return state;
};
