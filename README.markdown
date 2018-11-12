# HTTP Resources Status Made Easy With Redux

## Setup

In case you use npm:

```sh
npm install --save dd-redux-resource
```

In case you use yarn:

```sh
yarn install dd-redux-resource
```

## Usage

First, you need to install reducer and middleware:

```js
// src/store.ts
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
    ddReduxResourceReducer,
    ddResourceMiddleware,
    configure
} from 'dd-redux-resource';

const reducer = combineReducers({
    ddReduxResourceReducer
});

const store = createStore(reducer, applyMiddleware(thunk, ddResourceMiddleware));
store.dispatch(configure({
    backend: 'https://api.datadoghq.com/api/v1/',
    fetchOptions: {
        credentials: 'same-origin', // include, *same-origin, omit
        mode: "cors", // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }
}));

export { store };
```

Create your resources:

```js
import { createResource } from 'dd-redux-resource';

export const dashboardLists = createResource('/dashboard/lists/manual');

// Optionally you can override middleware default options
export const statusIo = createResource('/status.json', {
    backend: '//pageid.statuspage.io/api/v2/',
    fetchOptions: {}
});
```

And finally use it:

```js
import { dashboardLists } from './resources';

const mapDispatchToProps = dispatch => ({
    fetchAllDashboardList: (dispatch, getState) => {
        if (
            !dashboardLists.isLoadingList(getState()) &&
            !dashboardLists.isSuccessList(getState())
        ) {
            return dispatch(
                dashboardLists.list({
                    // Declare success on 200 status code
                    on200: response => response,
                    // Declare failure on any non 200 status
                    not200: response => Promise.reject(response)
                })
            );
        }

        return Promise.resolve();
    }
});
```

### Storing data:

To keep the footprint minimal, there is no built-in way to store your data. You
are free to do whatever you want with the API responses.

```js
import { dashboardLists } from './resources';

export const dashboardListsReducer = (state, action) => {
    switch (action.type) {
        case dashboardLists.list.SUCCESS:
            return {
                dashlists: action.response
            };

        case dashboardLists.list.FAILURE:
            return {
                dashlists: []
            };

        default:
            return state;
    }
};
```
