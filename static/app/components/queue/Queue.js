var React = require('react');

import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router';

let Colors = require('material-ui/lib/styles/colors');

const CircularProgress = require('material-ui/lib/circular-progress');

const List = require('material-ui/lib/lists/list');
const ListDivider = require('material-ui/lib/lists/list-divider');
const ListItem = require('material-ui/lib/lists/list-item');
const Paper = require('material-ui/lib/paper');
const Avatar = require('material-ui/lib/avatar');
const RaisedButton = require('material-ui/lib/raised-button');
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');

const QueueActions = require('../../actions/QueueActions');
const QueueStore = require('../../stores/QueueStore');
const ShartActions = require('../../actions/ShartActions');
const ShartStore = require('../../stores/ShartStore');


class Queue extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);
    this._listItemTouch = this._listItemTouch.bind(this);
    this._sharted = this._sharted.bind(this);

    this.state = this.getState();
    QueueStore.addChangeListener(this._onChange);
    ShartStore.addChangeListener(this._onChange);
  }

  getState () {
    return {
      queue: QueueStore.getQueue(),
      sharts: ShartStore.getSharts()
    };
  }

  componentWillUnmount () {
    QueueStore.removeChangeListener(this._onChange);
    ShartStore.removeChangeListener(this._onChange);
  }

  render () {
    var queues = []
    if (this.state.queue.length > 0) {
      queues = this.state.queue.map((queue) => {
        var sharts = 0;
        var sharts_today = 0;
        if (this.state.sharts.length > 0) {
          this.state.sharts.forEach((shart) => {
            if (queue.user.id == shart.user.id) {
              sharts += 1;

              var today = new Date();
              var shart_date = new Date(shart.date);
              if (today.toDateString() == shart_date.toDateString()) {
                sharts_today += 1;
              }
            }
          });
        }

        return (
            <ListItem
              key={queue.user.id}
              leftAvatar={<Avatar>{queue.user.username.substring(0,2)}</Avatar>}
              primaryText={queue.user.username}
              secondaryText={
                <p>
                  {queue.last_date}<br/>
                  <span style={{color: Colors.lime900}}>{sharts} sharts, {sharts_today} today</span>
                </p>
              }
              secondaryTextLines={2}
              rightIconButton={
                <IconButton
                  color={Colors.lime900}
                  iconClassName="material-icons"
                  onTouchTap={this._sharted.bind(this, queue.user.id)}>
                  cloud_queue
                </IconButton>
              }
              onTouchTap={this._listItemTouch.bind(this, queue.user.id)}>
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

  _listItemTouch (id) {
    this.props.history.pushState('user', '/user/' + id);
  }

  _sharted (id) {
    ShartActions.create({
      user: id
    });
  }

  _onChange () {
    this.setState(this.getState());
  }
}

module.exports = Queue;