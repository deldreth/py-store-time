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
        columns: ['User', 'Day'],
        rows: [],
        data: [],
        chartType: 'BarChart',
        options : {}
      }
    };
  }

  componentDidMount () {
    if (this.state.stats.by_day.length > 0) {
      var ByHourChart = {
        data: [['User', 'Day', {'role': 'style'}]],
        chartType: 'BarChart',
        options: {
          width: 500,
          height: 300,
          title: 'Test'
        },
        chartType: "BarChart"
      };
      
      var by_hour = this.state.stats.by_hour.forEach((hour) => {
        ByHourChart.data.push(['user' + hour.user, hour.hour]);
      });

      this.setState({
        ByHourChart: ByHourChart
      });
    }
  }

  render() {
    return (
      <div>
        <ChartWrapper chartType={this.state.ByHourChart.chartType}
          width={"500px"}
          height={"300px"}
          data={this.state.ByHourChart.data}
          options={this.state.ByHourChart.options}
          graph_id='by-hour'/>
      </div>
    );
  }

  _onChange() {
    this.setState({
      stats: ShartStore.getStats()
    });
  }
}
