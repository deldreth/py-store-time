var React = require('react');

import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router';

let Colors = require('material-ui/lib/styles/colors');

const CircularProgress = require('material-ui/lib/circular-progress');

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardHeader = require('material-ui/lib/card/card-header');
const CardTitle = require('material-ui/lib/card/card-title');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardText = require('material-ui/lib/card/card-text');

const Avatar = require('material-ui/lib/avatar');
const RaisedButton = require('material-ui/lib/raised-button');
const FlatButton = require('material-ui/lib/flat-button');

const QueueActions = require('../../actions/QueueActions');
const QueueStore = require('../../stores/QueueStore');
const ShartActions = require('../../actions/ShartActions');
const ShartStore = require('../../stores/ShartStore');
const HistoryStore = require('../../stores/HistoryStore');

import Payment from '../Payment';


class Queue extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);
    this._listItemTouch = this._listItemTouch.bind(this);
    this._pay = this._pay.bind(this);
    this._handlePayment = this._handlePayment.bind(this);

    this.state = this.getState();
    QueueStore.addChangeListener(this._onChange);
    ShartStore.addChangeListener(this._onChange);
    HistoryStore.addChangeListener(this._onChange);
  }

  getState () {
    return {
      queue: QueueStore.getQueue(),
      sharts: ShartStore.getSharts(),
      history: HistoryStore.getHistory(),
      payment_display: false,
      payment_queue: null
    };
  }

  componentWillUnmount () {
    QueueStore.removeChangeListener(this._onChange);
    ShartStore.removeChangeListener(this._onChange);
    HistoryStore.removeChangeListener(this._onChange);
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

        var history = {
          sum: 0,
          count: 0
        };
        if (this.state.history.length > 0) {
          this.state.history.forEach(object => {
            if (queue.user.id == object.user) {
              history.sum += object.amount;
              history.count += 1;
            }
          });
        }

        var avatar = <Avatar>{queue.user.username.substring(0, 2)}</Avatar>
        if (queue.avatar !== null) {
          var gravatar = 'http://www.gravatar.com/avatar/' + queue.avatar;
          avatar = <Avatar src={gravatar} />
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
                avatar={avatar}
                actAsExpander={true}
                showExpandableButton={true}/>
              <CardActions>
                <RaisedButton
                  primary={true}
                  label='Pay'
                  labelPosition='after'
                  onTouchTap={this._pay.bind(this, queue)}>
                </RaisedButton>
                <FlatButton label='History' secondary={true} onTouchTap={this._listItemTouch.bind(this, queue.user.id)}/>
              </CardActions>
              <CardText expandable={true}>
                <h4>Total Spent: <small>${history.sum}</small></h4>
                <h4>Total Payments: <small>{history.count}</small></h4>
              </CardText>
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
        <Row>
          <Col className='text-center'>
            <img src='static/img/shop-icon.png'/>
          </Col>
        </Row>
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

  _onChange () {
    this.setState(this.getState());
  }
}

module.exports = Queue;