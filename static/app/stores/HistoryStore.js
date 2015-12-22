var EventEmitter = require('events').EventEmitter;
var moment = require('moment');
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/Constants';

const CHANGE_EVENT = 'change';

class HistoryStore extends EventEmitter {
  constructor() {
    super();
    this.history = [];
    this.stats = null;
    this.loaded = false;
    this.errors = {};

    this.api = 'api/history/';
    this.api_stats = 'api/stats/';

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
        entry.date = moment(date).format('MM/DD/YYYY');
        entry.time = moment(date).format('h:mm a');
      });
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

  getStats () {
    if (this.stats == null) {
      $.ajax({
        url: this.api_stats + 'aggregates',
        method: 'GET',
        headers: {
          'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
        },
        cache: false,
      })
      .done((data) => {
        this.stats = data;
        this.loaded = true;
        this.emitChange();
      })
      .fail((xhr, status, err) => {
        this.loaded = true;
        this.emitChange();
      });
    }
    
    return this.stats;
  }

  create (data) {
    $.ajax({
      url: this.api,
      method: 'POST',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      data: {
        user: data.queue.user.id,
        date: new Date().toISOString(),
        amount: parseInt(data.amount)
      },
      cache: false,
    })
    .done((data) => {
      var date = new Date(data.date).toISOString();
      data.date = moment(date).format('MM/DD/YYYY');
      data.time = moment(date).format('h:mm a');
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