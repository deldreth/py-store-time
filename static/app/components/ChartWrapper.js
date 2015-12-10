var React = require('react');
var equal = require('deep-equal');

import { Chart } from 'react-google-charts'

var ChartWrapper = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return !equal(nextProps, this.props);
  },
  render: function () {
    return <Chart {...this.props}/>;
  }
});

module.exports = ChartWrapper;
