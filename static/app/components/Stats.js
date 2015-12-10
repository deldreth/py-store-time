var React = require('react');

import { Col, Row } from 'react-bootstrap';
import { Paper, List, ListItem, Avatar } from 'material-ui';

const HistoryStore = require('../stores/HistoryStore');


export default class Stats extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);

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
            secondaryText={'$' + sum.amount__sum}>
          </ListItem>
        );
      });

      avgs = this.state.stats.history_avgs.map((avg) => {
        return (
          <ListItem
            key={avg.user}
            leftAvatar={<Avatar>{avg.user.substring(0,2)}</Avatar>}
            primaryText={avg.user}
            secondaryText={'$' + avg.amount__avg}>
          </ListItem>
        );
      });
    }

    return (
      <div>
        <br/>
        <Paper zDepth={3}>
          <List subheader='Big Spenders (since forever)'>
            {sums}
          </List>
        </Paper>

        <br/>
        <Paper zDepth={3}>
          <List subheader='Average Paid by User'>
            {avgs}
          </List>
        </Paper>
      </div>
    );
  }

  _onChange () {
    this.setState(this.getState());
  }
}