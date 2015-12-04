var EventEmitter = require('events').EventEmitter;
var moment = require('moment');
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/Constants';

const CHANGE_EVENT = 'change';

class QueueStore extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.loaded = false;
    this.errors = {};

    this.api = 'api/queue/';

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
        var date = new Date(entry.last_date).toISOString();
        entry.last_date = moment(date).format('MMMM Do YYYY, h:mm a');
      });
      this.queue = data;
      this.loaded = true;
      this.emitChange();
    })
    .fail((xhr, status, err) => {
      this.loaded = true;
      this.emitChange();
    });
  }

  getQueue () {
    return this.queue;
  }

  create () {
    $.ajax({
      url: this.api,
      method: 'POST',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      cache: false,
    })
    .done((data) => {
      if (data.id != null) {
        this.queue.push(data);
        this.emitChange();
      }
    })
    .fail((xhr, status, err) => {
      this.emitChange();
    });
  }

  pay (data) {
    $.ajax({
      url: this.api + data.id,
      method: 'PATCH',
      headers: {
        'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      data: {
        last_date: new Date().toISOString()
      },
      cache: false,
    })
    .done((data) => {
      // Replace the queue state with the new data
      this.queue.forEach((object, index, queue) => {
        if (object.id == data.id) {
          queue[index] = data;
        }
      });
      this.emitChange();
      this.refresh();
    })
    .fail((xhr, status, err) => {
      this.emitChange();
    });
  }

  refresh () {
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
        var date = new Date(entry.last_date).toISOString();
        entry.last_date = moment(date).format('MMMM Do YYYY, h:mm a');
      });
      this.queue = data;
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

  emitChange() {
    this.emit(CHANGE_EVENT);
  }
}

const queueStore = new QueueStore();

queueStore.dispatchToken = Dispatcher.register(action => {switch (action.actionType) {
  case ActionTypes.QUEUE_CREATE:
    queueStore.create();
    break;
  case ActionTypes.QUEUE_UPDATE:
    queueStore.pay(action.data);
    break;
  default:
    // no op
}});

export default queueStore;