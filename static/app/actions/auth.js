import fetch from 'isomorphic-fetch';
import { checkStatus, getCSRF, setCSRF } from './utils';
import Cookies from 'js-cookie';

export const AUTH_API = 'http://127.0.0.1:8000/rest-auth/';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const FETCH_USER = 'FETCH_USER';

function loginRequest (user) {
  return {
    type: LOGIN_REQUEST,
    user
  };
}

function loginSuccess (user, auth_key) {
  return {
    type: LOGIN_SUCCESS,
    user,
    auth_key
  };
}

function loginFailure (user, error) {
  return {
    type: LOGIN_FAILURE,
    user,
    error
  };
}

export function login (username, password) {
  return dispatch => {
    dispatch(loginRequest(username));

    return fetch(AUTH_API + 'login/', {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRF()
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        dispatch(loginSuccess(username, json.key));
      })
      .catch((error) => {
        dispatch(loginFailure(username, error));
      });
  };
}

function logoutRequest (user) {
  return {
    type: LOGOUT_REQUEST
  };
}

function logoutSuccess () {
  return {
    type: LOGOUT_SUCCESS
  };
}

function logoutFailure (error) {
  return {
    type: LOGOUT_FAILURE,
    error: error
  };
}

export function logout () {
  return dispatch => {
    dispatch(logoutRequest());

    return fetch(AUTH_API + 'logout/', {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRF()
      }
    }).then(checkStatus)
      .then(response => response.json())
      .then((json) => {
        dispatch(logoutSuccess());
      })
      .catch((error) => {
        dispatch(logoutFailure(error));
      });
  };
}

export function fetchUser () {
  return (dispatch, getState) => {
    const { user } = getState();

    if (user) {
      return;
    }

    return fetch(AUTH_API + 'user/', {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRF()
      }
    }).then(checkStatus)
      .then(response => response.json())
      .then((json) => {
        dispatch({
          type: FETCH_USER,
          user: json
        });
      })
      .catch((error) => {
        dispatch(logoutFailure(error));
      });
  };
}

export function initAuth () {
  return (dispatch, getState) => {
    const { user } = getState();

    if (user) {
      return;
    }

    return fetch(AUTH_API + 'user/', {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRF()
      }
    }).then(checkStatus)
      .then(response => response.json())
      .then((json) => {
        dispatch({
          type: FETCH_USER,
          user: json
        });
      })
      .catch((error) => {
        
      });
  };
}
