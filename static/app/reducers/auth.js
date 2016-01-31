import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  FETCH_USER
} from '../actions/auth';

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
        authKey: action.key,
        loginError: null
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      });
    case LOGOUT_REQUEST:
      return Object.assign({}, state, {
        loggingOut: true
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        loggingIn: false,
        loggingOut: false,
        user: null,
        authKey: null
      });
    case LOGOUT_FAILURE:
      return Object.assign({}, state, {
        ...state,
        loggingIn: false,
        loggingOut: false,
        user: null,
        authKey: null
      });
    case FETCH_USER:
      return Object.assign({}, state, {
        ...state,
        user: action.user
      });
    default:
      return state;
  }
}
