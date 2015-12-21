import React from 'react';

const SettingsStore = require('../stores/SettingsStore');

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);

    this.state = this.getState();

    SettingsStore.addChangeListener(this._onChange);
  }

  getState () {
    return {
      settings: SettingsStore.getSettings()
    };
  }

  render() {
    return (
      <div>
        <h1>API Access</h1>
        <p>
          API access is available on some of the API endpoints through token authentication. Generally this just means
          that your API token can be set on a request to facilitate non session/csrf authentication.
        </p>
        <p>
          <code>Content-Type: application/json<br/>Authorization: Token {this.state.settings.token}</code>
        </p>

        <h1>API Documentation</h1>
        <p>
          The API is documented <a href='http://storetime.herokuapp.com/docs/'>here</a>.
        </p>
      </div>
    );
  }

  _onChange () {
    this.setState(this.getState());
  }
}
