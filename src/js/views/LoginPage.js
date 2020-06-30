import React, { Component } from "react";
import { NavLink as Link, Redirect } from "react-router-dom";
import {
    Container,
    Row,
    Form,
    FormText,
    FormGroup,
    Input,
    Button
}
from "reactstrap";
import { connect } from "react-redux";
import { login } from "../actions/authentication";

class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.state = { username: "", password: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        let { username, password } = this.state;
        this.props.login(username, password);
    }

    render() {
        let { from } = this.props.location.state || { from: { pathname: "/" } };
        let { authentication } = this.props

        if(authentication.isAuthenticated) return <Redirect to={ from } />

        let { username, password } = this.state;

        return(
              <Container fluid className="login-page">
                  <Row className="form-container">
                      <span className="form-title">Log in to your account</span>
                      <Form className="form" onSubmit={this.handleSubmit}>
                          <FormGroup>
                              <Input
                                  onChange={this.handleChange}
                                  value={username}
                                  type="text"
                                  name="username"
                                  placeholder="Username" />
                              <FormText className="form-text">
                                Username: admin
                              </FormText>
                          </FormGroup>
                          <FormGroup>
                              <Input
                                  onChange={this.handleChange}
                                  value={password}
                                  type="password"
                                  name="password"
                                  placeholder="Password"/>
                              <FormText className="form-text">
                                Password: 1234
                              </FormText>
                          </FormGroup>
                          <Button type="submit">Login</Button>
                      </Form>
                      <Link to="#">Forgotten Password?</Link>
                  </Row>
              </Container>
        );

    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    };
}

const mapDispatchToProps = {
    login: login
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
