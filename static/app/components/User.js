var React = require('react');
var moment = require('moment');

import { Col, Row } from 'react-bootstrap';

const CircularProgress = require('material-ui/lib/circular-progress');

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardMedia = require('material-ui/lib/card/card-media');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');
const Avatar = require('material-ui/lib/avatar');
const RaisedButton = require('material-ui/lib/raised-button');
const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');

const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');

const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');
const Paper = require('material-ui/lib/paper');

const QueueActions = require('../actions/QueueActions');
const QueueStore = require('../stores/QueueStore');
const HistoryActions = require('../actions/HistoryActions');
const HistoryStore = require('../stores/HistoryStore');
const ShartActions = require('../actions/ShartActions');
const ShartStore = require('../stores/ShartStore');

import Payment from './Payment';

class User extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);
    this._pay = this._pay.bind(this);
    this._handlePayment = this._handlePayment.bind(this);

    this.state = null;
    QueueStore.addChangeListener(this._onChange);
    HistoryStore.addChangeListener(this._onChange);
    ShartStore.addChangeListener(this._onChange);
  }

  getState () {
    return {
      userId: this.props.params.userId,
      queue: QueueStore.getQueue().filter((object) => {
        return object.user.id == this.props.params.userId;
      })[0],
      history: HistoryStore.getHistory(),
      sharts: ShartStore.getSharts().filter((object) => {
        return object.user.id == this.props.params.userId;
      }),
      payment_display: false,
      payment_queue: null,
      tabsValue: "payments"
    };
  }

  componentDidMount () {
    this.setState(this.getState());
  }

  componentWillUnmount () {
    QueueStore.removeChangeListener(this._onChange);
    HistoryStore.removeChangeListener(this._onChange);
  }

  render () {
    var context = (
      <div className='text-center'>
        <CircularProgress mode='indeterminate' size={5} />
      </div>
    );

    if (this.state != null) {
      var history = this.state.history.map((object) => {
        if (this.state.userId == object.user) {
          return (
            <TableRow key={object.id}>
              <TableRowColumn>{object.date}</TableRowColumn>
              <TableRowColumn>{object.time}</TableRowColumn>
              <TableRowColumn>${object.amount}</TableRowColumn>
            </TableRow>
          );
        }
      });

      var sharts = this.state.sharts.map(object => {
        var date = new Date(object.date).toISOString();
        var date_only = moment(date).format('MM/DD/YYYY');
        var time = moment(date).format('h:mm a');

        return (
          <TableRow key={object.id}>
            <TableRowColumn>{date_only}</TableRowColumn>
            <TableRowColumn>{time}</TableRowColumn>
          </TableRow>
        );
      });

      context = (
        <Row>
          <Col md={12}>
            <Card initiallyExpanded={true}>
              <CardHeader
                title={this.state.queue.user.username}
                subtitle={this.state.queue.last_date}
                avatar={<Avatar>{this.state.queue.user.username.substring(0,2)}</Avatar>}>
              </CardHeader>
              <CardActions>
                <RaisedButton 
                  label="Pay"
                  primary={true}
                  fullWidth={true}
                  onTouchTap={this._pay.bind(this, this.state.queue)}/>
              </CardActions>
              <CardText>
                <Tabs>
                  <Tab label="Payments" value="payments">
                    <Table>
                      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                          <TableHeaderColumn>Date</TableHeaderColumn>
                          <TableHeaderColumn>Time</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody displayRowCheckbox={false}>
                        {history}
                      </TableBody>
                    </Table>
                  </Tab>
                  <Tab label="Sharts" value="sharts">
                    <Table>
                      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                          <TableHeaderColumn>Date</TableHeaderColumn>
                          <TableHeaderColumn>Time</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody displayRowCheckbox={false}>
                        {sharts}
                      </TableBody>
                    </Table>
                  </Tab>
                </Tabs>
              </CardText>
            </Card>

            <Payment display={this.state.payment_display} queue={this.state.payment_queue} handlePayment={this._handlePayment.bind(this)} />
          </Col>
        </Row>
      );
    }
    return (
      <div>
        <br/>
        {context}
      </div>
    );
  }

  _pay (queue) {
    this.setState({
      payment_display: true,
      payment_queue: queue
    });
  }

  _handlePayment () {
    this.setState({
      payment_display: false,
      payment_queue: null
    });
  }

  _handleTabsChange () {

  }

  _onChange () {
    this.setState(this.getState());
  }
}

module.exports = User;