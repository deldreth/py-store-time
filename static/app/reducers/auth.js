import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from '../actions/UserActions';

const initialState = {
  user: null,
  loggingIn: false,
  loggingOut: false,
  loginError: null,
  authKey: null
};

function initializeState () {
  return Object.assign({}, initialState);
}

export default function auth (state = initializeState(), action = {}) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        loggingIn: true
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loggingIn: false,
        user: action.user,
        authKey: action.key
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      });
    default:
      return state;
  }
}
