import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
    return(
        <Route
            {...rest}
            render={ props => rest.authentication.isAuthenticated ?
                <Component {...props} /> :
                <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            }
        />
    );
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    };
}

export default connect(mapStateToProps)(PrivateRoute);
