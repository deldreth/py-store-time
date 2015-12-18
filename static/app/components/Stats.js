var React = require('react');

import { Col, Row } from 'react-bootstrap';
import { Paper, List, ListItem, Avatar } from 'material-ui';

const HistoryStore = require('../stores/HistoryStore');


export default class Stats extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);
    this._listItemTouch = this._listItemTouch.bind(this);

    this.state = this.getState();
    HistoryStore.addChangeListener(this._onChange);
  }

  getState () {
    return {
      stats: HistoryStore.getStats(),
    };
  }

  componentWillUnmount () {
    HistoryStore.removeChangeListener(this._onChange);
  }

  render () {
    var sums = [];
    var avgs = [];
    if (this.state.stats != null) {
      sums = this.state.stats.history_sums.map((sum) => {
        return (
          <ListItem
            key={sum.user}
            leftAvatar={<Avatar>{sum.user.substring(0,2)}</Avatar>}
            primaryText={sum.user}
            secondaryText={'$' + sum.amount__sum}
            onTouchTap={this._listItemTouch.bind(this, sum.user_id)}>
          </ListItem>
        );
      });

      avgs = this.state.stats.history_avgs.map((avg) => {
        return (
          <ListItem
            key={avg.user}
            leftAvatar={<Avatar>{avg.user.substring(0,2)}</Avatar>}
            primaryText={avg.user}
            secondaryText={'$' + parseFloat(avg.amount__avg).toFixed(2)}
            onTouchTap={this._listItemTouch.bind(this, avg.user_id)}>
          </ListItem>
        );
      });
    }

    return (
      <Row>
        <Col md={6}>
          <h3>Big Spenders (since forever)</h3>
          <Paper>
            <List>
              {sums}
            </List>
          </Paper>
        </Col>

        <Col md={6}>
          <h3>Average Paid by User</h3>
          <Paper>
            <List>
              {avgs}
            </List>
          </Paper>
        </Col>
      </Row>
    );
  }

  _listItemTouch (id) {
    this.props.history.pushState('user', '/user/' + id);
  }

  _onChange () {
    this.setState(this.getState());
  }
}