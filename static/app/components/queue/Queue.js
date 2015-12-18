var React = require('react');

import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router';

let Colors = require('material-ui/lib/styles/colors');

const CircularProgress = require('material-ui/lib/circular-progress');

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardMedia = require('material-ui/lib/card/card-media');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');

const List = require('material-ui/lib/lists/list');
const ListDivider = require('material-ui/lib/lists/list-divider');
const ListItem = require('material-ui/lib/lists/list-item');
const Paper = require('material-ui/lib/paper');
const Avatar = require('material-ui/lib/avatar');
const RaisedButton = require('material-ui/lib/raised-button');
const FlatButton = require('material-ui/lib/flat-button');
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');
const FloatingActionButton = require('material-ui/lib/floating-action-button');

const QueueActions = require('../../actions/QueueActions');
const QueueStore = require('../../stores/QueueStore');
const ShartActions = require('../../actions/ShartActions');
const ShartStore = require('../../stores/ShartStore');

import Payment from '../Payment';


class Queue extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);
    this._listItemTouch = this._listItemTouch.bind(this);
    this._sharted = this._sharted.bind(this);
    this._pay = this._pay.bind(this);
    this._handlePayment = this._handlePayment.bind(this);

    this.state = this.getState();
    QueueStore.addChangeListener(this._onChange);
    ShartStore.addChangeListener(this._onChange);
  }

  getState () {
    return {
      queue: QueueStore.getQueue(),
      sharts: ShartStore.getSharts(),
      payment_display: false,
      payment_queue: null
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
          <div key={queue.user.id}>
            <Card>
              <CardHeader
                title={queue.user.username}
                subtitle={
                  <p>
                    {queue.last_date}<br/>
                    <span style={{color: Colors.lime900}}>{sharts} sharts, {sharts_today} today</span>
                  </p>
                }
                avatar={<Avatar>{queue.user.username.substring(0,2)}</Avatar>}/>
              <CardActions>
                <RaisedButton
                  primary={true}
                  label='Pay'
                  labelPosition='after'
                  onTouchTap={this._pay.bind(this, queue)}>
                </RaisedButton>
                <RaisedButton label='Shart' onTouchTap={this._sharted.bind(this, queue.user.id)}/>
                <FlatButton label='History' secondary={true} onTouchTap={this._listItemTouch.bind(this, queue.user.id)}/>
              </CardActions>
            </Card>
            <br/>
          </div>
        );
      });
    }

    return (
      <div>
        <h1>The Almighty Queue</h1>
        {queues}

        <Payment display={this.state.payment_display} queue={this.state.payment_queue} handlePayment={this._handlePayment.bind(this)} />
      </div>
    );
  }

  _pay (queue) {
    this.setState({
      payment_display: true,
      payment_queue: queue
    });
  }

  _handlePayment () {
    this.setState({
      payment_display: false,
      payment_queue: null
    });
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