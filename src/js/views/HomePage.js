import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
    Container,
    Row,
    Form,
    FormText,
    FormGroup,
    Label,
    Input,
    Button
}
from "reactstrap";
import { connect } from "react-redux";
import { logout } from "../actions/authentication";
import { getData } from "../actions/data";


class HomePage extends Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.getCookie = this.getCookie.bind(this);
    }

    componentDidMount() {
        this.props.getData();
    }

    logout() {
        this.props.logout();
        this.props.history.push("/login");
    }

    getCookie(name) {
      let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
    }

    render() {
        let { data } = this.props
        return(
              <Container fluid className="home-page">
                  <Row className="form-container">
                      <span className="form-title">Server: { data.data }</span>
                      <Form className="form">
                          <FormGroup>
                              <Label>Access Token</Label>
                              <Input
                                type="textarea"
                                value={window.localStorage.getItem("token")}
                                readOnly/>
                              <FormText className="form-text">
                                Token expires in 10 seconds.
                              </FormText>
                          </FormGroup>
                          <FormGroup>
                              <Label>Refresh Token</Label>
                              <Input
                                type="textarea"
                                value={this.getCookie("token")}
                                readOnly/>
                              <FormText className="form-text">
                                Token expires in 20 seconds.
                              </FormText>
                          </FormGroup>
                          <Button onClick={this.logout}>Logout</Button>
                      </Form>
                  </Row>
              </Container>
        );

    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        data: state.data
    };
}

const mapDispatchToProps = {
    logout: logout,
    getData: getData
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
