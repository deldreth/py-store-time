import fetch from 'isomorphic-fetch';
import { checkStatus, getCSRF } from './utils';

const API_START = 'http://127.0.0.1:8000/api/';

export const QUEUE_CREATE = 'QUEUE_CREATE';
export const QUEUE_READ = 'QUEUE_READ';
export const QUEUE_UPDATE = 'QUEUE_UPDATE';
export const QUEUE_FAILURE = 'QUEUE_FAILURE';

function queueCreate (user) {
  return {
    type: QUEUE_CREATE,
    user
  };
}

function queueRead (queue) {
  return {
    type: QUEUE_READ,
    queue
  };
}

function queueUpdate (queue) {
  return {
    type: QUEUE_UPDATE,
    queue
  };
}

function queueFailure (user, error) {
  return {
    type: QUEUE_FAILURE,
    user,
    error
  };
}

export function create (user) {
  return dispatch => {
    dispatch(queueCreate(user));

    return fetch(API_START + 'queue/', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRF()
      },
      body: JSON.stringify({
        user
      })
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        dispatch(queueUpdate(json.queue));
      })
      .catch((error) => {
        dispatch(queueFailure(user, error));
      });
  };
}
