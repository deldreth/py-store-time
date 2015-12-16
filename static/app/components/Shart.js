import React from 'react';

import { Row, Col } from 'react-bootstrap';

const Paper = require('material-ui/lib/paper');

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardMedia = require('material-ui/lib/card/card-media');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');

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
      facts: [
        'Farts get their noxious smell from just 1% of the gas you expel.',
        'The average healthy human passes gas about 14 times a day.',
        'Some food and drink, like eggs and meat, can cause stinkier farts because they are rich in sulfur.',
        'Farts have been clocked at speeds of up to 10 feet per second. Almost 7 mph.',
        'Flatulence varies in sound due to a variety of factors, namely, the amount of gas, the force at which it is expelled, and the tightness of the sphincter muscles.',
        'All the humans that have ever lived have released approximately 17 quadrillion farts. EVER.'
      ]
    };
  }

  render() {
    var ByHourChart = {
      data: null,
      chartType: 'ColumnChart',
      options: {
        title: 'Sharts by Hour of Day',
        hAxis: {
          title: 'Hour',
          slantedText: true,
          slantedTextAngle: 45
        },
        vAxis: {title: 'Count'},
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
        title: 'Sharts by Day of Week',
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

    var fact = this.state.facts[Math.floor((Math.random() * this.state.facts.length))];

    return (
      <div>
        <br/>
        <Row>
          <Col md={12}>
            <blockquote>{fact}</blockquote>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardMedia>
                <ChartWrapper
                  width={'100%'}
                  height={"300px"}
                  data={ByHourChart.data}
                  options={ByHourChart.options}
                  graphName='by-hour'
                  chartType={ByHourChart.chartType}/>
              </CardMedia>
            </Card>
          </Col>
        </Row>

        <br/>

        <Row>
          <Col md={12}>
            <Card>
              <CardMedia>
                <ChartWrapper
                  width={'100%'}
                  height={"300px"}
                  data={ByDayChart.data}
                  options={ByDayChart.options}
                  graphName='by-day'
                  chartType={ByDayChart.chartType}/>
              </CardMedia>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  _onChange() {
    this.setState({
      stats: ShartStore.getStats()
    });
  }
}
