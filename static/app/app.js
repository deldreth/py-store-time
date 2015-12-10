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
var Shart = require('./components/Shart');

ReactDOM.render(
  <Router>
    <Route path='/' component={StoreTime}>
      <Route path='/user/:userId' component={User}/>
      <Route path='shart' component={Shart} />
    </Route>
    <Route path='signup' component={Signup}/>
  </Router>,
  document.getElementById('app')
);
