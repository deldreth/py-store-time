var React = require('react');

import { Col, Row } from 'react-bootstrap';

let Colors = require('material-ui/lib/styles/colors');

const TextField = require('material-ui/lib/text-field');
const RaisedButton = require('material-ui/lib/raised-button');
const Paper = require('material-ui/lib/paper');
const LinearProgress = require('material-ui/lib/linear-progress');

const AuthStore = require('../../stores/AuthStore');
const UserActions = require('../../actions/UserActions');


class Login extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);
    this._login = this._login.bind(this);
    
    AuthStore.addChangeListener(this._onChange);

    this.state = this.getState();
  }

  getState () {
    return {
      user: AuthStore.getUser(),
      errors: AuthStore.getErrors(),
      loading: false
    };
  }

  componentWillUnmount () {
    AuthStore.removeChangeListener(this._onChange);
  }

  render () {
    var errors = [];
    for(var error in this.state.errors) {
      errors.push(this.state.errors[error][0]);
    }

    var errors_formatted = errors.map(error => {
      return (
        <p>
          <span className='material-icons' style={{color: Colors.red500}}>error</span> {error}
        </p>
      );
    });

    return (
      <div>
        <form ref='loginForm'>
          <LinearProgress ref='loadingBar' mode='indeterminate' color={Colors.orange500} style={!this.state.loading ? {display: 'none'} : {display: 'block'}}/>

          <Row>
            <Col md={12}>
              <br/>
              <Paper>
                {errors_formatted}
              </Paper>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <TextField
                name='username'
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
                hintText='Much secure.'
                floatingLabelText='Password'
                type='password'
                fullWidth={true}/>
            </Col>
          </Row>
          
          <Row>
            <Col md={12} className='text-center'>

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

  _login () {
    this.setState({
      errors: [],
      loading: true
    });
    var formData = $(this.refs.loginForm).serializeArray();
    var formObject = {};
    formData.forEach(function (input) {
      formObject[input.name] = input.value;
    });
    UserActions.login(formObject);
  }

  _onChange () {
    this.setState(this.getState());
  }
}

module.exports = Login;