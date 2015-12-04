var EventEmitter = require('events').EventEmitter;
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
    console.log('no op');
    // no op
}});

export default queueStore;