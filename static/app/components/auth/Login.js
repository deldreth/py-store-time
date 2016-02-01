import React, { Component, PropType } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

let Colors = require('material-ui/lib/styles/colors');

const TextField = require('material-ui/lib/text-field');
const RaisedButton = require('material-ui/lib/raised-button');
const LinearProgress = require('material-ui/lib/linear-progress');

import { login } from '../../actions/auth';

export default class Login extends Component {
  constructor (props) {
    super(props);
    this._login = this._login.bind(this);
  }

  _login (event) {
    event.preventDefault();

    this.props.dispatch(login(
      this.refs.username.getValue(),
      this.refs.password.getValue()
      )
    );
  }

  render () {
    return (
      <form>
        <Row>
          <Col md={12}>
            <TextField
              name='username'
              ref='username'
              hintText='Wut is dat user name? Tsk tsk.'
              floatingLabelText='Username'
              type='text'
              fullWidth/>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <TextField
              name='password'
              ref='password'
              hintText='Much secure.'
              floatingLabelText='Password'
              type='password'
              fullWidth/>
          </Col>
        </Row>

        <Row>
          <Col md={12} className='text-right'>
            <RaisedButton
              primary
              label='Log In'
              onTouchTap={this._login}/>
          </Col>
        </Row>
      </form>
    );
  }
}

function testConnect (state) {
  return {};
}

export default connect(testConnect)(Login);
