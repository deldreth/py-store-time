import fetch from 'isomorphic-fetch';
import { checkStatus } from './utils';

const API_START = 'http://127.0.0.1:8000/rest-auth/';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

function loginRequest (user) {
  return {
    type: LOGIN_REQUEST,
    user
  };
}

function loginSuccess (auth_key) {
  return {
    type: LOGIN_SUCCESS,
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

    return fetch(API_START + 'login/', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'X-CSRFToken': $('meta[name=csrf-token]').attr('content')
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        dispatch(loginSuccess(json.key));
      })
      .catch((error) => {
        dispatch(loginFailure(username, error));
      });
  };
}

function logoutRequest (user) {
  return {
    type: LOGOUT_REQUEST,
    user
  };
}
