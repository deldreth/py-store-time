var React = require('react');

import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router';

const CircularProgress = require('material-ui/lib/circular-progress');

const List = require('material-ui/lib/lists/list');
const ListDivider = require('material-ui/lib/lists/list-divider');
const ListItem = require('material-ui/lib/lists/list-item');
const Paper = require('material-ui/lib/paper');
const Avatar = require('material-ui/lib/avatar');
const RaisedButton = require('material-ui/lib/raised-button');
const FloatingActionButton = require('material-ui/lib/floating-action-button');

const QueueActions = require('../../actions/QueueActions');
const QueueStore = require('../../stores/QueueStore');


class Queue extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);

    this.state = this.getState();
    QueueStore.addChangeListener(this._onChange);
  }

  getState () {
    return {
      queue: QueueStore.getQueue(),
    };
  }

  componentWillUnmount () {
    QueueStore.removeChangeListener(this._onChange);
  }

  render () {
    var queues = []
    if (this.state.queue.length > 0) {
      queues = this.state.queue.map((queue) => {
        return (
            <ListItem
              key={queue.user.id}
              leftAvatar={<Avatar>{queue.user.username.substring(0,2)}</Avatar>}
              primaryText={queue.user.username}
              secondaryText={queue.last_date}
              href={'#/user/' + queue.user.id}>
            </ListItem>
        );
      });
    }

    return (
      <div>
        <br/>
        <Paper zDepth={3}>
          <List subheader='The Almighty Queue'>
            {queues}
          </List>
        </Paper>
      </div>
    );
  }

  _onChange () {
    this.setState(this.getState());
  }
}

module.exports = Queue;