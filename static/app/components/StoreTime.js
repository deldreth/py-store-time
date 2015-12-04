var React = require('react');

const CircularProgress = require('material-ui/lib/circular-progress');

const Queue = require('./queue/Queue');
const Login = require('./auth/Login');
const AuthStore = require('../stores/AuthStore');
const QueueStore = require('../stores/QueueStore');

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
        context = <Queue history={this.props.history} />;
      }
    }
    else if (AuthStore.loaded && this.state.user === null) {
      context = <Login />;
    }
    
    return (
      <div>
        {context}
      </div>
    );
  }

  _onChange () {
    this.setState(this.getState());
  }
}

module.exports = StoreTime;