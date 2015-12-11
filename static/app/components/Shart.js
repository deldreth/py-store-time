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
    if (this.state.stats.by_hour) {
      // Bubble Chart
      var ByHourChart = {
        // data: [['Hour', 'Count']],
        data: [['id', 'Hour', 'Count', 'Color', 'Count']],
        chartType: 'BarChart',
        options: {
          hAxis: {
            title: 'Hour',
            // min: 0,
            // max: 23,
            // viewWindow: {
            //   min: 0,
            //   max: 23
            // }
          },
          vAxis: {title: 'Count'},
          bubble: {
            fontSize: 11
          }
        },
        chartType: "BarChart"
      };

      var by_hour = this.state.stats.by_hour;
      for(var date in by_hour) {
        by_hour[date].data.forEach((data) => {
          ByHourChart.data.push([data.user.substring(0, 2), new Date(data.date), data.count, data.user, data.count]);
        });
      }

      this.setState({
        ByHourChart: ByHourChart
      });
    }
  }

  render() {
    return (
      <div>
        <ChartWrapper
          width={'100%'}
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
