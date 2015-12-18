var React = require('react');

import { Col, Row } from 'react-bootstrap';
import { Paper, List, ListItem, Avatar } from 'material-ui';

const ChartWrapper = require('./ChartWrapper');

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

    var ByMonthChart = {
      data: null,
      chartType: 'ColumnChart',
      options: {
        title: 'Total Spent by Month/Year',
        hAxis: {
          title: 'Date'
        },
        vAxis: {title: 'Amount'},
        animation: {
          startup: true,
          duration: 2000,
          easing: 'out'
        }
      }
    };
    if (this.state.stats) {
      var data = [['Date', 'Amount']];
      this.state.stats.by_month_sums.forEach(entry => {
        data.push([entry.month_year, entry.total]);
      });
      ByMonthChart.data = data;
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

        <Col md={12}>
          <br/>
          <Paper>
            <ChartWrapper
              width={'100%'}
              height={"300px"}
              data={ByMonthChart.data}
              options={ByMonthChart.options}
              graphName='by-month-year'
              chartType={ByMonthChart.chartType}/>
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