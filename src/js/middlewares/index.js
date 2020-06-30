import { refresh } from "../actions/authentication";
import { REFRESH } from "../constants/actionTypes";

// Create buffer to store dispatched actions
let buffer = [];
export function asyncActionsMiddleware(store) {
    return function(next) {
        return function(action) {

            // This middleware only handles async actions
            if(action.hasOwnProperty("httpService") && action.httpService) {
                // Store action in buffer
                if (action.type !== REFRESH) buffer.push(action);
                // Dispatch action
                store.dispatch(request());
                action.httpService(...action.params)
                    .then(response => {
                      // Check response status
                      if (response.ok) {
                        response.json()
                          .then(data => store.dispatch(success(data)))
                          .then(() => {
                            // Retry actions before token expired
                            if (action.type === REFRESH) {
                              for (let i = 0; i < buffer.length; i++) {
                                store.dispatch(buffer[i]);
                                buffer.shift();
                              }
                            }
                          });
                      } else if (response.status === 401){
                          // Unauthorized error
                          store.dispatch(failure(response.statusText));
                          // Try to refresh token
                          if (action.type !== REFRESH) store.dispatch(refresh());
                      } else {
                        // Dispatch action failure
                        store.dispatch(failure(response.statusText));
                      }
                    })
                    .catch(error => store.dispatch(failure(error)));

                function request() { return { type: generateRequestActionType(action.type) }};
                function success(payload) { return { type: generateSuccessActionType(action.type), payload }};
                function failure(error) { return { type: generateFailureActionType(action.type), error }};
            }

            return next(action);
        }
    }
}

export const generateRequestActionType = actionType => `${actionType}_REQUEST`;
export const generateSuccessActionType = actionType => `${actionType}_SUCCESS`;
export const generateFailureActionType = actionType => `${actionType}_FAILURE`;
