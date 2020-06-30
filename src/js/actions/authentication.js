import { LOGIN, LOGOUT, REFRESH } from "../constants/actionTypes";
import { authenticationServices } from "../services/authentication"

export function login(username, password) {
    return function(dispatch) {
        dispatch({ type: LOGIN, httpService: authenticationServices.login, params: [ username, password ] });
    }
}

export function refresh() {
    return function(dispatch) {
        dispatch({ type: REFRESH, httpService: authenticationServices.refresh, params: [] });
    }
}

export function logout() { return { type: LOGOUT }; }
