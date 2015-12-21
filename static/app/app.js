// include top level components
var React = require('react');
var ReactDOM = require('react-dom');
let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import { Router, Route, } from 'react-router'
import { Col, Row } from 'react-bootstrap';

var StoreTime = require('./components/StoreTime');
var Stats = require('./components/Stats');
var User = require('./components/User');
var Signup = require('./components/auth/Signup');
var Shart = require('./components/Shart');
var Settings = require('./components/Settings');

ReactDOM.render(
  <Router>
    <Route path='/' component={StoreTime}>
      <Route path='/user/:userId' component={User}/>
      <Route path='stats' component={Stats} />
      <Route path='shart' component={Shart} />
      <Route path='settings' component={Settings} />
    </Route>
    <Route path='signup' component={Signup}/>
  </Router>,
  document.getElementById('app')
);
