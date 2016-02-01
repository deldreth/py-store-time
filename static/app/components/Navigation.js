var React = require('react');
const AppBar = require('material-ui/lib/app-bar');
const LeftNav = require('material-ui/lib/left-nav');
const MenuItem = require('material-ui/lib/menu/menu-item');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const FontIcon = require('material-ui/lib/font-icon');
const FloatingActionButton = require('material-ui/lib/floating-action-button');

let Colors = require('material-ui/lib/styles/colors');
const MyRawTheme = require('../theme');

const ShartActions = require('../actions/ShartActions');

var menuItems = [
  { route: '/', text: 'Queue'},
  { route: 'stats', text: 'Statistics'},
  { route: 'shart', text: 'Sharts' },
  { type: MenuItem.Types.SUBHEADER, text: 'Resources' },
  { route: 'settings', text: 'Settings' },
];

export default class Navigation extends React.Component {
  constructor (props) {
    super(props);
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
    var shartAction;
    if (this.props.user) {
      shartAction = (
        <FloatingActionButton backgroundColor={Colors.lime600} mini={false} style={{position: 'fixed', bottom: 25, right: 25}}>
          <FontIcon className='material-icons' onTouchTap={this._sharted}>cloud_queue</FontIcon>
        </FloatingActionButton>);
    }
    return (
      <div>
        <LeftNav
          ref="leftNav"
          docked={false}
          menuItems={menuItems}
          onChange={this._onNavChange}>
        </LeftNav>

        <AppBar
          title={<span>Store Time</span>}
          onLeftIconButtonTouchTap={this.showNavigation}
          iconElementRight={shartAction}/>
      </div>
    );
  }
}

Navigation.propTypes = {
  user: React.PropTypes.object
};

Navigation.defaultProps = {
  user: {
    username: '',
    email: ''
  }
};

Navigation.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Navigation;