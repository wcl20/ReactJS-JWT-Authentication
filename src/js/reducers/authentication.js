import { LOGIN, LOGOUT, REFRESH } from "../constants/actionTypes";
import { generateRequestActionType, generateSuccessActionType, generateFailureActionType } from "../middlewares";

const initialState = { isAuthenticated: window.localStorage.getItem("token") !== null, isLoading: false };

export function authentication(state = initialState, action) {
    switch(action.type) {
        case generateRequestActionType(LOGIN):
            return Object.assign({}, state, { isLoading: true, error: null });
        case generateSuccessActionType(REFRESH):
        case generateSuccessActionType(LOGIN):
            // Save JWT in local storage
            window.localStorage.setItem("token", action.payload.message)
            return Object.assign({}, state, { isLoading: false, isAuthenticated: true });
        case generateFailureActionType(LOGIN):
            return Object.assign({}, state, { isLoading: false, error: action.error });
        case generateFailureActionType(REFRESH):
        case LOGOUT:
            // Remove JWT from local storage
            window.localStorage.removeItem("token")
            return Object.assign({}, state, { isLoading: false, isAuthenticated: false })
        default:
            return state;
    }
}
