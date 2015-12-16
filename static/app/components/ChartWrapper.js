var React = require('react');
var equal = require('deep-equal');

export default class ChartWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.drawChart = this.drawChart.bind(this);
  }

  componentDidMount (){
    this.drawChart();
  }

  componentDidUpdate (){
    this.drawChart();
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !equal(nextProps, this.props);
  }

  drawChart (){
    var data = google.visualization.arrayToDataTable(this.props.data);
    var options = this.props.options;
    var chart = null;

    console.log(this.props.chartType);

    switch (this.props.chartType) {
      case 'BubbleChart':
        chart = new google.visualization.BubbleChart(
          document.getElementById(this.props.graphName)
        );
        break;
      case 'ColumnChart':
        chart = new google.visualization.ColumnChart(
          document.getElementById(this.props.graphName)
        );
        break;
    }

    chart.draw(data, options);
  }

  render() {
    return React.DOM.div({id: this.props.graphName, style: {height: this.props.height, width: this.props.width}});
  }
}
