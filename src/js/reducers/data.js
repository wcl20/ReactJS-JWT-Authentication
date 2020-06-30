import { DATA } from "../constants/actionTypes";
import { generateRequestActionType, generateSuccessActionType, generateFailureActionType } from "../middlewares";

const initialState = { data: "", isLoading: false };

export function data(state = initialState, action) {
    switch(action.type) {
        case generateRequestActionType(DATA):
            return Object.assign({}, state, { isLoading: true, error: null });
        case generateSuccessActionType(DATA):
            let data = action.payload.message;
            return Object.assign({}, state, { isLoading: false, data });
        case generateFailureActionType(DATA):
            return Object.assign({}, state, { isLoading: false, error: action.error });
        default:
            return state;
    }
}
