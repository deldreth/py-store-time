var React = require('react');
const AppBar = require('material-ui/lib/app-bar');
const LeftNav = require('material-ui/lib/left-nav');
const MenuItem = require('material-ui/lib/menu/menu-item');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const MyRawTheme = require('../theme');

var menuItems = [
  { route: '/', text: 'Queue'},
  { route: 'shart', text: 'Sharts' }
];

class Navigation extends React.Component {
  constructor () {
    super();
    this.showNavigation = this.showNavigation.bind(this);
    this._onNavChange = this._onNavChange.bind(this);
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

  render () {
    return (
      <div>
        <LeftNav
          ref="leftNav"
          docked={false}
          menuItems={menuItems}
          onChange={this._onNavChange}/>

        <AppBar
          title="Store Time"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.showNavigation}/>
      </div>
    );
  }
}

Navigation.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Navigation;