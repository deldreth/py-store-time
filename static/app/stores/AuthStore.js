var EventEmitter = require('events').EventEmitter;
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/Constants';

const CHANGE_EVENT = 'change';


class AuthStore extends EventEmitter {
  constructor() {
    super();
    this.user = null;
    this.key = null;
    this.loaded = false;
    this.errors = {};

    this.api = 'rest-auth/';

    $.ajax({
      url: this.api + 'user/',
      dataType: 'json',
      method: 'GET',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      cache: false,
    })
    .done((data) => {
      this.user = data;
      this.loaded = true;
      this.emitChange();
    })
    .fail((xhr, status, err) => {
      this.user = null;
      this.loaded = true;
      this.emitChange();
    });
  }

  signUp (data) {
    $.ajax({
      url: this.api + 'registration/',
      method: 'POST',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      data: data,
      cache: false,
    })
    .done((data) => {
      if (data.key != null) {
        window.location = '/';
      }
      this.emitChange();
    })
    .fail((xhr, status, err) => {
      this.errors = xhr.responseJSON;
      this.emitChange();
    });
  }

  login (data) {
    $.ajax({
      url: this.api + 'login/',
      method: 'POST',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      data: data,
      cache: false,
    })
    .done((data) => {
      this.user = data;
      this.emitChange();
    })
    .fail((xhr, status, err) => {
      this.errors = xhr.responseJSON;
      this.emitChange();
    });
  }

  logout () {
    $.ajax({
      url: this.api + 'logout/',
      method: 'POST',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      cache: false,
    })
    .done((data) => {
      this.emitChange();
    })
    .fail((xhr, status, err) => {
      this.errors = xhr.responseJSON;
      this.emitChange();
    });
  }

  getUser() {
    return this.user;
  }

  getErrors () {
    return this.errors;
  }

  getKey () {
    return this.key;
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

const authStore = new AuthStore();

authStore.dispatchToken = Dispatcher.register(action => {switch (action.actionType) {
  case ActionTypes.USER_LOGIN:
    authStore.login(action.data);
    break;
  case ActionTypes.USER_LOGOUT:
    authStore.logout();
    break;
  case ActionTypes.USER_SIGNUP:
    authStore.signUp(action.data);
    break;
  case ActionTypes.USER_UPDATE:
    break;
  default:
    // no op
}});

export default authStore;