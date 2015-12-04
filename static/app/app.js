// include top level components
var React = require('react');
var ReactDOM = require('react-dom');
let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import { Router, Route, } from 'react-router'
import { Col, Row } from 'react-bootstrap';

var StoreTime = require('./components/StoreTime');
var User = require('./components/User');
var Signup = require('./components/auth/Signup');
const Navigation = require('./components/Navigation');

ReactDOM.render(
  <div>
    <Navigation />

    <div className='container'>
      <Row>
        <Col md={6} mdOffset={3}>
          <Router>
            <Route path='/' component={StoreTime}>
              <Route path='/user/:userId' component={User}/>
            </Route>
            <Route path='signup' component={Signup}/>
          </Router>
        </Col>
      </Row>
    </div>
  </div>,
  document.getElementById('app')
);
