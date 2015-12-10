import React from 'react';

var BarChart = require('react-chartjs').Bar;

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
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          datasets: [
            {
              label: "My First dataset",
              data: []
            },
            {
              label: "My Second dataset",
              data: []
            }
          ],
        },
        chartType: 'BarChart',
        options : {}
      }
    };
  }

  componentDidMount () {
    if (this.state.stats.by_day.length > 0) {
      var ByHourChart = this.state.ByHourChart;
      this.state.stats.by_hour.forEach((hour) => {
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
        <BarChart data={this.state.ByHourChart.data} options={this.state.ByHourChart.options} width="600" height="250"/>
      </div>
    );
  }

  _onChange() {
    this.setState({
      stats: ShartStore.getStats()
    });
  }
}
