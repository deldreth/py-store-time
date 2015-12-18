import React from 'react';
import { Dialog } from 'material-ui';

const TextField = require('material-ui/lib/text-field');

const QueueActions = require('../actions/QueueActions');
const QueueStore = require('../stores/QueueStore');
const HistoryActions = require('../actions/HistoryActions');
const HistoryStore = require('../stores/HistoryStore');


export default class Payment extends React.Component {
  constructor(props) {
    super(props);

    this._logOnly = this._logOnly.bind(this);
    this._logPayment = this._logPayment.bind(this);

    this.state = this.getState();

    this.actions = [
      { text: 'Just Log It!', onTouchTap: this._logOnly },
      { text: 'Woo. Money.', onTouchTap: this._logPayment, ref: 'submit', primary: true }
    ];
  }

  getState () {
    return {
    };
  }

  render() {
    return (
      <Dialog
        title="Very nice. How much?"
        actionFocus="submit"
        actions={this.actions}
        open={this.props.display}
        onRequestClose={this.hide}>
        <form ref='paymentForm'>
          <TextField
            name='amount'
            hintText='Dolla dolla bills yo'
            floatingLabelText='Amount'
            type='text'
            ref='amountTextField'
            fullWidth={true}/>
        </form>
      </Dialog>
    );
  }

  _logOnly () {
    QueueActions.update(this.props.queue);
    HistoryActions.create({
      queue: this.props.queue,
      amount: 0
    });
    this.props.handlePayment();
  }

  _logPayment () {
    var formData = $(this.refs.paymentForm).serializeArray();
    var formObject = {};
    formData.forEach(function (input) {
      formObject[input.name] = input.value;
    });

    QueueActions.update(this.props.queue);
    HistoryActions.create({
      queue: this.props.queue,
      amount: formObject.amount
    });
    this.props.handlePayment();
  }
}
