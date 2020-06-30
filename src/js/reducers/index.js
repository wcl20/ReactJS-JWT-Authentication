import { combineReducers } from "redux";
import { authentication } from "./authentication";
import { data } from "./data";

const rootReducer = combineReducers({
    authentication,
    data
});
export default rootReducer;
