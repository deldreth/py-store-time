var EventEmitter = require('events').EventEmitter;
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/Constants';

const CHANGE_EVENT = 'change';

class HistoryStore extends EventEmitter {
  constructor() {
    super();
    this.history = [];
    this.loaded = false;
    this.errors = {};

    this.api = 'api/history/';

    $.ajax({
      url: this.api,
      method: 'GET',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      cache: false,
    })
    .done((data) => {
      this.history = data;
      this.loaded = true;
      this.emitChange();
    })
    .fail((xhr, status, err) => {
      this.loaded = true;
      this.emitChange();
    });
  }

  getHistory () {
    return this.history;
  }

  create (data) {
    $.ajax({
      url: this.api,
      method: 'POST',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      data: {
        user: data.user.id,
        date: new Date().toISOString()
      },
      cache: false,
    })
    .done((data) => {
      this.history.unshift(data);
    })
    .fail((xhr, status, err) => {
    });
  }

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }
}

const historyStore = new HistoryStore();

historyStore.dispatchToken = Dispatcher.register(action => {switch (action.actionType) {
  case ActionTypes.HISTORY_CREATE:
    historyStore.create(action.data);
    break;
  default:
    // no op
}});

export default historyStore;