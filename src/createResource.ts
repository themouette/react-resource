import { uniqueId } from 'lodash';
import { Dispatch } from 'redux';

import {
    GET,
    fetchStart,
    fetchSuccess,
    fetchFailure,
    getIsResourceFetching,
    getIsResourceSuccess,
    getIsResourceFailure
} from './resources';
import {
    combinePath,
    combineQueries,
    stringifyQuery
} from './queryString';
import {
    ResourceLifecycle,
    FetchResponse,
    FullState,
    QueryString
} from './types';

enum ResourceMethod {
    LIST = 'LIST',
    GET = 'GET'
}
// Generate a unique
const actionId = (
    resourceId: string,
    method: ResourceMethod,
    lifecycle: ResourceLifecycle
): string => `dd-redux-resource/${resourceId}/LIFECYCLE/${method}/${lifecycle}`;

const generateRequestId = (
    method: ResourceMethod,
    path: string,
    resourceId: string,
    query: QueryString = ''
) => `${method}(${resourceId})#${path}?${stringifyQuery(query)}`;

interface CreateResourceOptions {
    /* Specify a resource id */
    id: string;
    /* Default query string for all calls */
    queryParams?: QueryString;
}

const createResourceList = <P>(
    resourcePath: string,
    { id, queryParams: resourceQueryString }: CreateResourceOptions
) => {
    const list = (queryString: QueryString = '') => (
        dispatch: Dispatch
    ): Promise<FetchResponse<P>> => {
        // id do not bother about default params to ensure
        // selectors needs the exact same params as the action
        const requestId = list.requestId(queryString);
        const combinedQueryString = combineQueries(resourceQueryString, queryString);

        dispatch(fetchStart(requestId, list.start));

        return dispatch(GET(resourcePath, combinedQueryString)).then(
            (response: FetchResponse<P>) => {
                dispatch(fetchSuccess(requestId, list.success, response));
                return response;
            },
            error => dispatch(fetchFailure(requestId, list.failure, error))
        );
    };
    // Compute a unique request id
    list.requestId = (queryString: QueryString = '') =>
        generateRequestId(ResourceMethod.LIST, '/', id, queryString);
    list.start = actionId(id, ResourceMethod.LIST, ResourceLifecycle.START);
    list.success = actionId(id, ResourceMethod.LIST, ResourceLifecycle.SUCCESS);
    list.failure = actionId(id, ResourceMethod.LIST, ResourceLifecycle.FAILURE);

    list.isFetching = (
        state: FullState,
        queryString: QueryString = ''
    ): boolean => {
        // Compute a unique request id
        const requestId = list.requestId(queryString);
        return getIsResourceFetching(state, { requestId });
    };
    list.isSuccess = (
        state: FullState,
        queryString: QueryString = ''
    ): boolean => {
        // Compute a unique request id
        const requestId = list.requestId(queryString);
        return getIsResourceSuccess(state, { requestId });
    };
    list.isFailure = (
        state: FullState,
        queryString: QueryString = ''
    ): boolean => {
        // Compute a unique request id
        const requestId = list.requestId(queryString);
        return getIsResourceFailure(state, { requestId });
    };

    return list;
};

const createResourceGet = <P>(
    resourcePath: string,
    { id, queryParams: resourceQueryString }: CreateResourceOptions
) => {
    const get = (path: string, queryString: QueryString = '') => (
        dispatch: Dispatch
    ): Promise<FetchResponse<P>> => {
        // id do not bother about default params to ensure
        // selectors needs the exact same params as the action
        const requestId = get.requestId(path, queryString);
        const combinedQueryString = combineQueries(resourceQueryString, queryString);

        dispatch(fetchStart(requestId, get.start));
        const fullPath = combinePath(resourcePath, path);

        return dispatch(GET(fullPath, combinedQueryString)).then(
            (response: FetchResponse<P>) => {
                dispatch(fetchSuccess(requestId, get.success, response));
                return response;
            },
            error => dispatch(fetchFailure(requestId, get.failure, error))
        );
    };
    // Compute a unique request id
    get.requestId = (path: string, queryString: QueryString = '') =>
        generateRequestId(ResourceMethod.GET, path, id, queryString);
    get.start = actionId(id, ResourceMethod.GET, ResourceLifecycle.START);
    get.success = actionId(id, ResourceMethod.GET, ResourceLifecycle.SUCCESS);
    get.failure = actionId(id, ResourceMethod.GET, ResourceLifecycle.FAILURE);

    get.isFetching = (
        state: FullState,
        path: string,
        queryString: QueryString = ''
    ): boolean => {
        // Compute a unique request id
        const requestId = get.requestId(path, queryString);
        return getIsResourceFetching(state, { requestId });
    };
    get.isSuccess = (
        state: FullState,
        path: string,
        queryString: QueryString = ''
    ): boolean => {
        // Compute a unique request id
        const requestId = get.requestId(path, queryString);
        return getIsResourceSuccess(state, { requestId });
    };
    get.isFailure = (
        state: FullState,
        path: string,
        queryString: QueryString = ''
    ): boolean => {
        // Compute a unique request id
        const requestId = get.requestId(path, queryString);
        return getIsResourceFailure(state, { requestId });
    };

    return get;
};

export const createResource = <L>(
    resourcePath: string,
    options: Partial<CreateResourceOptions> = {}
) => {
    // Generate a unique resource id if none provided
    const finalOptions = {
        id: options.id || uniqueId(),
        ...options
    };

    return {
        list: createResourceList(resourcePath, finalOptions),
        get: createResourceGet(resourcePath, finalOptions)
    };
};
