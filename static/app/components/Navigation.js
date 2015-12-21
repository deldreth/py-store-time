var React = require('react');
var md5 = require('md5');
const AppBar = require('material-ui/lib/app-bar');
const LeftNav = require('material-ui/lib/left-nav');
const MenuItem = require('material-ui/lib/menu/menu-item');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LinearProgress = require('material-ui/lib/linear-progress');
const FontIcon = require('material-ui/lib/font-icon');
const FloatingActionButton = require('material-ui/lib/floating-action-button');
const Avatar = require('material-ui/lib/avatar');
let Colors = require('material-ui/lib/styles/colors');
const MyRawTheme = require('../theme');

const ShartActions = require('../actions/ShartActions');

var menuItems = [
  { route: '/', text: 'Queue'},
  { route: 'stats', text: 'Statistics'},
  { route: 'shart', text: 'Sharts' }
];

class Navigation extends React.Component {
  constructor () {
    super();
    this.showNavigation = this.showNavigation.bind(this);
    this._onNavChange = this._onNavChange.bind(this);
    this._sharted = this._sharted.bind(this);
  }

  showNavigation (event) {
    this.refs.leftNav.toggle();
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
    };
  }

  _onNavChange(e, key, payload) {
    this.props.history.push(payload.route);
  }

  _sharted () {
    ShartActions.create({
      user: this.props.user.username
    });
  }

  render () {
    var avatar = <img src='/static/img/shop-icon.png' style={{height: '75px'}} />

    return (
      <div>
        <LeftNav
          ref="leftNav"
          docked={false}
          menuItems={menuItems}
          onChange={this._onNavChange}/>

        <AppBar
          title={<span>{avatar} Store Time</span>}
          onLeftIconButtonTouchTap={this.showNavigation}
          iconElementRight={
            <FloatingActionButton mini={false}>
              <FontIcon className='material-icons' onTouchTap={this._sharted}>cloud_queue</FontIcon>
            </FloatingActionButton>
            }/>
      </div>
    );
  }
}

Navigation.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Navigation;