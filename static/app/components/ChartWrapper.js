var React = require('react');
var equal = require('deep-equal');

export default class ChartWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount (){
    this.drawChart();
  }

  componentDidUpdate (){
    this.drawChart();
  }

  drawChart (){
    var data = google.visualization.arrayToDataTable(this.props.data);
    var options = this.props.options;

    var chart = new google.visualization.BubbleChart(
      document.getElementById(this.props.graphName)
    );
    chart.draw(data, options);
  }

  render() {
  	return React.DOM.div({id: this.props.graphName, style: {height: this.props.height, width: this.props.width}});
  }
}
