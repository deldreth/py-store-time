var React = require('react');
const AppBar = require('material-ui/lib/app-bar');
const LeftNav = require('material-ui/lib/left-nav');
const MenuItem = require('material-ui/lib/menu/menu-item');

var menuItems = [
  { route: 'history', text: 'History' },
  { type: MenuItem.Types.SUBHEADER, text: 'Settings' },
  { route: 'settings', text: 'User' },
  { route: 'logout', text: 'Log Out' },
];

class Navigation extends React.Component {
  constructor () {
    super();
    this.showNavigation = this.showNavigation.bind(this);
    this._getSelectedIndex = this._getSelectedIndex.bind(this);
  }

  showNavigation (event) {
    this.refs.leftNav.toggle();
  }

  _getSelectedIndex() {
    let currentItem;
  }

  render () {
    return (
      <div>
        <LeftNav ref="leftNav" docked={false} />

        <AppBar
          title="Store Time"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.showNavigation}/>
      </div>
    );
  }
}

module.exports = Navigation;