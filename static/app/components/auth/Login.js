import React from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

let Colors = require('material-ui/lib/styles/colors');

const TextField = require('material-ui/lib/text-field');
const RaisedButton = require('material-ui/lib/raised-button');
const LinearProgress = require('material-ui/lib/linear-progress');

import { login } from '../../actions/UserActions';

class Login extends React.Component {
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
      <div>
        <form ref='loginForm'>
          <LinearProgress 
            ref='loadingBar' 
            mode='indeterminate' 
            color={Colors.orange500} 
            style={!this.props.loading ? {display: 'none'} : {display: 'block'}}/>

          <Row>
            <Col md={12}>
              <TextField
                name='username'
                ref='username'
                hintText='Wut is dat user name? Tsk tsk.'
                floatingLabelText='Username'
                type='text'
                fullWidth={true}/>
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
                fullWidth={true}/>
            </Col>
          </Row>

          <Row>
            <Col md={12} className='text-right'>
              <RaisedButton
                primary={true}
                label='Log In'
                onTouchTap={this._login}/>
            </Col>
          </Row>
        </form>

        <hr/>

        <div className='text-center'>
          <RaisedButton
            linkButton={true}
            label='Sign Up'
            href='#/signup'/>
        </div>
      </div>
    );
  }
}

function testConnect (state) {
  return {};
}

export default connect(testConnect)(Login);
