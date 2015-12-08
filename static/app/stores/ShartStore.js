var EventEmitter = require('events').EventEmitter;
var moment = require('moment');
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/Constants';

const CHANGE_EVENT = 'change';

class ShartStore extends EventEmitter {
  constructor() {
    super();
    this.sharts = [];
    this.loaded = false;
    this.errors = {};

    this.api = 'api/shart/';

    $.ajax({
      url: this.api,
      method: 'GET',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      cache: false,
    })
    .done((data) => {
      data.forEach(entry => {
        var date = new Date(entry.date).toISOString();
        entry.last_date = moment(date).format('MMMM Do YYYY, h:mm a');
      });
      this.sharts = data;
      this.loaded = true;
      this.emitChange();
    })
    .fail((xhr, status, err) => {
      this.loaded = true;
      this.emitChange();
    });
  }

  getSharts () {
    return this.sharts;
  }

  create (data) {
    $.ajax({
      url: this.api,
      method: 'POST',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      data: {
        user: data.user
      },
      cache: false,
    })
    .done((data) => {
      var date = new Date(data.date).toISOString();
      data.date = moment(date).format('MMMM Do YYYY, h:mm a');

      this.sharts.push(data);
      this.emitChange();
    })
    .fail((xhr, status, err) => {
      this.emitChange();
    });
  }

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange () {
    this.emit(CHANGE_EVENT);
  }
}

const shartStore = new ShartStore();

shartStore.dispatchToken = Dispatcher.register(action => {switch (action.actionType) {
  case ActionTypes.SHART_CREATE:
    shartStore.create(action.data);
    break;
  default:
  // no op
}});

export default shartStore;