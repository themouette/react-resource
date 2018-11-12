import { Dispatch, Middleware, MiddlewareAPI, AnyAction } from 'redux';

import { ActionFetch, ActionTypes, FetchResponse } from './types';
import { getRequestConfig, getRequestQualifiedUrl } from './config';


/**
 * Make the actual call for the FETCH action
 */
const handleFetchAction = (action: ActionFetch, store: MiddlewareAPI): Promise<FetchResponse<any>> => {
    let ret: FetchResponse<any>;

    return fetch(
        getRequestQualifiedUrl(store.getState(), action.payload),
        getRequestConfig(store.getState(), action.payload)
    )
        .then((response: Response) => {
            ret = {
                status: response.status,
                data: null,
                response
            }
            return response.json();
        }).then(data => {
            ret.data = data;
            return ret;
        });
};

export const ddResourceMiddleware: Middleware = (store: MiddlewareAPI) => (
    next: Dispatch
) => (action: AnyAction) => {
    if (action.type !== ActionTypes.FETCH) {
        // Immediately forward actions that are not related to ddResourceMiddleware
        return next(action);
    }

    // Only intercept the FETCH actions.
    next(action); // forward action to ensure we see it in the devtools
    return handleFetchAction(action as ActionFetch, store);
};
