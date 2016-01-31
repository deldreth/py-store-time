var React = require('react');

import { Col, Row } from 'react-bootstrap';

const TextField = require('material-ui/lib/text-field');
const RaisedButton = require('material-ui/lib/raised-button');

const AuthStore = require('../../stores/AuthStore');
const QueueStore = require('../../stores/QueueStore');
const UserActions = require('../../actions/auth');


class Signup extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);
    this._signup = this._signup.bind(this);
    
    AuthStore.addChangeListener(this._onChange);

    this.state = this.getState();
  }

  getState () {
    return {
      user: AuthStore.getUser(),
      errors: AuthStore.getErrors(),
      key: AuthStore.getKey(),
    }
  }

  componentDidUpdate () {
    if (this.state.user != null) {
      window.location = '/';
    }
    
    if (this.state.key != null) {
      this.props.history.replaceState('login', '/');
    }
  }

  render () {
    return (
      <div>
        <form ref='signupForm'>
          <Row>
            <Col md={12}>
              <TextField
                name='username'
                hintText='I just gotta know.'
                floatingLabelText='Username'
                type='text'
                fullWidth={true}
                errorText={this.state.errors.username ? this.state.errors.username : ''}/>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <TextField
                name='password1'
                hintText='First the first password.'
                floatingLabelText='Password'
                type='password'
                fullWidth={true}
                errorText={this.state.errors.password1 ? this.state.errors.password1 : ''}/>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <TextField
                name='password2'
                hintText='Now the same password.'
                floatingLabelText='Password (confirm)'
                type='password'
                fullWidth={true}
                errorText={this.state.errors.password2 ? this.state.errors.password2 : ''}/>
            </Col>
          </Row>

          <Row>
            <Col md={12} className='text-right'>
              <RaisedButton
                primary={true}
                label='Sign Up'
                onTouchTap={this._signup}/>
            </Col>
          </Row>
        </form>
      </div>
    );
  }

  _signup () {
    var formData = $(this.refs.signupForm).serializeArray();
    var formObject = {};
    formData.forEach(function (input) {
      formObject[input.name] = input.value;
    });
    UserActions.signup(formObject);
  }

  _onChange () {
    this.setState(this.getState());
  }
}

module.exports = Signup;