import React from 'react';

const ChartWrapper = require('./ChartWrapper');
const ShartStore = require('../stores/ShartStore');

export default class Shart extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);

    this.state = this.getState();

    ShartStore.addChangeListener(this._onChange);
  }

  getState () {
    return {
      stats: ShartStore.getStats(),
      ByHourChart: {
        columns: ['User', 'Hour'],
        rows: [],
        data: [],
        chartType: 'BarChart',
        options : {}
      }
    };
  }

  componentDidUpdate () {

  }

  render() {
    var ByHourChart = {
      data: null,
      chartType: 'ColumnChart',
      options: {
        hAxis: {
          title: 'Hour',
        },
        vAxis: {title: 'Count'},
        bubble: {
          fontSize: 11
        },
        animation: {
          startup: true,
          duration: 2000,
          easing: 'out'
        }
      }
    };
    if (this.state.stats.by_hour) {
      ByHourChart.data = this.state.stats.by_hour;
    }

    var ByDayChart = {
      data: null,
      chartType: 'ColumnChart',
      options: {
        hAxis: {
          title: 'Day of Week',
        },
        vAxis: {title: 'Count'},
        bubble: {
          fontSize: 11
        },
        animation: {
          startup: true,
          duration: 2000,
          easing: 'out'
        }
      }
    };
    if (this.state.stats.by_day) {
      ByDayChart.data = this.state.stats.by_day;
    }

    return (
      <div>
        <ChartWrapper
          width={'100%'}
          height={"300px"}
          data={ByHourChart.data}
          options={ByHourChart.options}
          graphName='by-hour'
          chartType={ByHourChart.chartType}/>

        <ChartWrapper
          width={'100%'}
          height={"300px"}
          data={ByDayChart.data}
          options={ByDayChart.options}
          graphName='by-day'
          chartType={ByDayChart.chartType}/>
      </div>
    );
  }

  _onChange() {
    this.setState({
      stats: ShartStore.getStats()
    });
  }
}
