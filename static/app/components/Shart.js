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
      data: [['id', 'Hour', 'Count', 'Color', 'Count']],
      chartType: 'BarChart',
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
      },
      chartType: 'BubbleChart'
    };
    if (this.state.stats.by_hour) {
      var by_hour = this.state.stats.by_hour;
      for(var date in by_hour) {
        by_hour[date].data.forEach((data) => {
          ByHourChart.data.push([data.user.substring(0, 2), new Date(data.date), data.count, data.user, data.count]);
        });
      }
    }

    return (
        <ChartWrapper
          width={'100%'}
          height={"300px"}
          data={ByHourChart.data}
          options={ByHourChart.options}
          graphName='by-hour'
          chartType={ByHourChart.chartType}/>
    );
  }

  _onChange() {
    this.setState({
      stats: ShartStore.getStats()
    });
  }
}
