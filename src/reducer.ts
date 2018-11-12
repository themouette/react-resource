import { combineReducers, AnyAction } from 'redux';
import { State, ActionTypes } from './types';

import { configReducer } from './config';
import { resourcesReducer } from './resources';

export const ddReduxResourceReducer = combineReducers<State, AnyAction>({
    config: configReducer,
    resources: resourcesReducer
});
