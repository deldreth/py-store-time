var EventEmitter = require('events').EventEmitter;
var moment = require('moment');
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/Constants';

const CHANGE_EVENT = 'change';

class SettingsStore extends EventEmitter {
  constructor() {
    super();
    this.settings = {};
    this.loaded = false;
    this.errors = {};

    this.api = 'api/settings/';

    $.ajax({
      url: this.api,
      method: 'GET',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      cache: false,
    })
    .done((data) => {
      this.settings = data;
      this.loaded = true;
      this.emitChange();
    })
    .fail((xhr, status, err) => {
      this.loaded = true;
      this.emitChange();
    });
  }

  getSettings () {
    return this.settings;
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

const settingsStore = new SettingsStore();

settingsStore.dispatchToken = Dispatcher.register(action => {switch (action.actionType) {
  default:
  // no op
}});

export default settingsStore;