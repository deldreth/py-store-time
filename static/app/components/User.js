var React = require('react');

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

const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

const QueueActions = require('../actions/QueueActions');
const QueueStore = require('../stores/QueueStore');
const HistoryActions = require('../actions/HistoryActions');
const HistoryStore = require('../stores/HistoryStore');

class User extends React.Component {
  constructor () {
    super();
    this._onChange = this._onChange.bind(this);
    this._pay = this._pay.bind(this);

    this.state = null;
    QueueStore.addChangeListener(this._onChange);
    HistoryStore.addChangeListener(this._onChange);
  }

  getState () {
    return {
      userId: this.props.params.userId,
      queue: QueueStore.getQueue().filter((object) => {
        return object.user.id == this.props.params.userId;
      })[0],
      history: HistoryStore.getHistory()
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
              <TableRowColumn></TableRowColumn>
            </TableRow>
          );
        }
      });

      context = (
        <Card initiallyExpanded={true}>
          <CardHeader
            title={this.state.queue.user.username}
            subtitle={this.state.queue.real_date}
            avatar={<Avatar>{this.state.queue.user.username.substring(0,2)}</Avatar>}>
          </CardHeader>
          <CardActions>
            <RaisedButton 
              label="Pay"
              primary={true}
              fullWidth={true}
              onTouchTap={this._pay}/>
          </CardActions>
          <CardText>
            <h4>Woo Dat History</h4>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Date</TableHeaderColumn>
                  <TableHeaderColumn>Time</TableHeaderColumn>
                  <TableHeaderColumn>Amount</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {history}
              </TableBody>
            </Table>
          </CardText>
        </Card>
      );
    }
    return (
      <div>
        <br/>
        {context}
      </div>
    );
  }

  _pay () {
    QueueActions.update(this.state.queue);
    HistoryActions.create(this.state.queue);
  }

  _onChange () {
    this.setState(this.getState());
  }
}

module.exports = User;