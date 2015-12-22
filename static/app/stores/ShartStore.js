var EventEmitter = require('events').EventEmitter;
var moment = require('moment');
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/Constants';

const CHANGE_EVENT = 'change';

class ShartStore extends EventEmitter {
  constructor() {
    super();
    this.sharts = [];
    this.stats = [];
    this.loaded = false;
    this.errors = {};

    this.api = 'api/shart/';
    this.api_stats = 'api/shart/stats/'

    $.ajax({
      url: this.api,
      method: 'GET',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      cache: false,
    })
    .done((data) => {
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

  getStats () {
    if (this.stats.length == 0) {
      $.ajax({
        url: this.api_stats,
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
        user: data.user
      },
      cache: false,
    })
    .done((data) => {
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