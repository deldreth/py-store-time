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

  componentDidMount () {
    if (this.state.stats.by_hour.length > 0) {
      console.log('test');
      var ByHourChart = {
        data: [['User', 'Hour', 'Count', 'Color', 'Count']],
        chartType: 'BarChart',
        options: {
          width: 800,
          height: 500,
          hAxis: {
            title: 'Hour',
            min: 0,
            max: 23,
            viewWindow: {
              min: 0,
              max: 23
            }
          },
          vAxis: {title: 'Count'},
        },
        chartType: "BarChart"
      };

      console.log('hour');
      this.state.stats.by_hour.forEach((hour) => {
        console.log(hour);
        ByHourChart.data.push([hour.user, hour.hour, hour.count, hour.user, hour.count]);
      });

      this.setState({
        ByHourChart: ByHourChart
      });
    }
  }

  render() {
    return (
      <div>
        <ChartWrapper
          width={"500px"}
          height={"300px"}
          data={this.state.ByHourChart.data}
          options={this.state.ByHourChart.options}
          graphName='by-hour'/>
      </div>
    );
  }

  _onChange() {
    this.setState({
      stats: ShartStore.getStats()
    });
  }
}
