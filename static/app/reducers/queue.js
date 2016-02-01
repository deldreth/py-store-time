import * as types from '../constants/ActionTypes';

const initialState = {
  queue: null
};

function initializeState () {
  return Object.assign({}, initialState);
}

export default function queue (state = initializeState(), action = {}) {
  switch (action.type) {
    case types.FETCH_QUEUE:
      return Object.assign({}, state, {
      });
    case types.PAY:
      return Object.assign({}, state, {
      });
    default:
      return state;
  }
}
