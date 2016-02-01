import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import { initAuth } from '../actions/auth';

import Login from './auth/Login';
import Queue from './queue/Queue';

class StoreTime extends Component {
  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(initAuth());
  }

  renderContent () {
    const { user } = this.props;

    if (!user) {
      return <Login />;
    } else if (this.props.children) {
      return this.props.children;
    } else {
      // The Queue component is the primary component of the app
      return <Queue history={this.props.history}/>;
    }
  }

  render () {
    return (
      <div className='container'>
        <Row>
          <Col md={12}>
            {this.renderContent()}
          </Col>
        </Row>
      </div>
    );
  }
}

StoreTime.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  children: PropTypes.object,
  user: PropTypes.object
};

function mapStateToProps (state) {
  const { auth } = state;

  return {
    user: auth.user
  };
}

export default connect(mapStateToProps)(StoreTime);
