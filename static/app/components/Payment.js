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

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
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
      display: this.props.display,
      queue: QueueStore.getQueue().filter((object) => {
        return object.user.id == this.props.user;
      })[0],
    };
  }

  show () {
    this.setState({display: true});
  }

  hide () {
    this.setState({display: false});
  }

  componentDidUpdate () {
    if (this.state.display) {
      this.refs.amountTextField.focus();
    }
  }

  render() {
    return (
      <Dialog
        title="Very nice. How much?"
        actionFocus="submit"
        actions={this.actions}
        open={this.state.display}
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
    QueueActions.update(this.state.queue);
    HistoryActions.create({
      queue: this.state.queue,
      amount: 0
    });
    this.hide();
  }

  _logPayment () {
    var formData = $(this.refs.paymentForm).serializeArray();
    var formObject = {};
    formData.forEach(function (input) {
      formObject[input.name] = input.value;
    });

    QueueActions.update(this.state.queue);
    HistoryActions.create({
      queue: this.state.queue,
      amount: formObject.amount
    });
    this.hide();
  }
}
