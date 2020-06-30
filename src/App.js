import React from 'react';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import LoginPage from "./js/views/LoginPage";
import HomePage from "./js/views/HomePage";
import PrivateRoute from "./js/components/PrivateRoute";

import './scss/main.scss';

import configureStore from "./js/store";
const store = configureStore();

function App() {
    return(
        <Provider store={store}>
            <Router>
                <Switch>
                    <PrivateRoute exact path="/" component={HomePage}/>
                    <Route path="/login" component={LoginPage} />
                </Switch>
            </Router>
        </Provider>
    );
}

export default App;
