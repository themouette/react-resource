import {
    ConfigState,
    FullState,
    ActionFetchPayload,
    REDUCER_KEY,
    HttpMethod
} from './types';
import { getRequestConfig, getRequestQualifiedUrl } from './config';

const fakeState = (config: Partial<ConfigState> = {}): FullState => ({
    [REDUCER_KEY]: {
        config: {
            backend: 'https://datadoghq.com/api/v1',
            fetchOptions: {
                credentials: 'include'
            } as RequestInit,
            ...config
        },
        resources: {
            isFetching: [],
            isSuccess: [],
            isFailure: []
        }
    }
});

const fakeActionPayload = (
    payload: Partial<ActionFetchPayload> = {}
): ActionFetchPayload => ({
    method: HttpMethod.GET,
    path: '/path',
    ...payload
});

describe('config', () => {
    describe('#getRequestConfig()', () => {
        it('should override state config with given params', () => {
            const state = fakeState();
            const payload = fakeActionPayload({
                fetchOptions: { credentials: 'omit' }
            });

            const fetchOptions = getRequestConfig(state, payload);
            expect(fetchOptions).toEqual({
                credentials: 'omit'
            });
        });
    });

    describe('#getRequestQualifiedUrl()', () => {
        it('should concat path and backend', () => {
            const state = fakeState();
            const payload = fakeActionPayload({
                path: '/foo',
                fetchOptions: { credentials: 'omit' }
            });

            const fullUrl = getRequestQualifiedUrl(state, payload);
            expect(fullUrl).toEqual('https://datadoghq.com/api/v1/foo');
        });
    });
});
