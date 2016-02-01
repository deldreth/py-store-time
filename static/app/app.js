// include top level components
var React = require('react');
var ReactDOM = require('react-dom');
let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';

import configureStore from './store/configureStore';

var StoreTime = require('./components/StoreTime');
var Stats = require('./components/Stats');
var User = require('./components/User');
var Signup = require('./components/auth/Signup');
var Shart = require('./components/Shart');
var Settings = require('./components/Settings');


const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path='/' component={StoreTime}>
        <Route path='/user/:userId' component={User}/>
        <Route path='stats' component={Stats} />
        <Route path='shart' component={Shart} />
        <Route path='settings' component={Settings} />
      </Route>
      <Route path='signup' component={Signup}/>
    </Router>
  </Provider>,
  document.getElementById('app')
);
