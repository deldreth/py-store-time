var React = require('react');

import { Row, Col } from 'react-bootstrap';

const CircularProgress = require('material-ui/lib/circular-progress');

const ThemeManager = require('material-ui/lib/styles/theme-manager');
const MyRawTheme = require('../theme');

const Navigation = require('./Navigation');
const Queue = require('./queue/Queue');
const Login = require('./auth/Login');
const AuthStore = require('../stores/AuthStore');
const QueueStore = require('../stores/QueueStore');
const Stats = require('./Stats');

class StoreTime extends React.Component { 
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);

    AuthStore.addChangeListener(this._onChange);
    this.state = this.getState();
  }

  getState () {
    return {
      user: AuthStore.getUser()
    };
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
    };
  }

  componentWillUnmount () {
    AuthStore.removeChangeListener(this._onChange);
  }

  componentDidMount () {
    QueueStore.create();
  }

  render () {
    var context = (
      <div className='text-center'>
        <CircularProgress mode='indeterminate' size={5} />
      </div>
    );

    if (AuthStore.loaded && this.state.user !== null) {
      if (this.props.children) {
        context = this.props.children;
      }
      else {
        context = (
          <Row>
            <Col md={6}>
              <Queue history={this.props.history} />
            </Col>
            <Col md={6}>
              <Stats />
            </Col>
          </Row>
        );
      }
    }
    else if (AuthStore.loaded && this.state.user === null) {
      context = <Login />;
    }
    
    return (
      <div>
        <Navigation history={this.props.history} />

        <div className='container'>
          <Row>
            <Col md={10} mdOffset={1}>
              {context}
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  _onChange () {
    this.setState(this.getState());
  }
}

StoreTime.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = StoreTime;