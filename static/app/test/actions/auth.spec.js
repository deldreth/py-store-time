import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import * as actions from '../../actions/auth';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('async auth actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should dispatch LOGIN_SUCCESS after logging in', (done) => {
    nock(actions.AUTH_API)
      .post('/login/', {
        username: 'user',
        password: 'password'
      })
      .reply(200, {
        key: 'auth token'
      });

    const exceptedActions = [
      { type: actions.LOGIN_REQUEST, user: 'user' },
      { type: actions.LOGIN_SUCCESS, auth_key: 'auth token' }
    ];

    const store = mockStore({}, exceptedActions, done);
    store.dispatch(actions.login('user', 'password'));
  });

  it('should dispatch LOGIN_FAILURE after failure to log in', (done) => {
    nock(actions.AUTH_API)
      .post('/login/', {
        username: 'user',
        password: 'password'
      })
      .reply(400, {
        error: Error()
      });

    const exceptedActions = [
      { type: actions.LOGIN_REQUEST, user: 'user' },
      { type: actions.LOGIN_FAILURE, user: 'user', error: Error() }
    ];

    const store = mockStore({}, exceptedActions, done);
    store.dispatch(actions.login('user', 'password'));
  });

  it('should dispatch LOGOUT_SUCCESS after logging out', (done) => {
    nock(actions.AUTH_API)
      .post('/logout/')
      .reply(200, {
        'success': 'logout'
      });

    const exceptedActions = [
      { type: actions.LOGOUT_REQUEST },
      { type: actions.LOGOUT_SUCCESS }
    ];

    const store = mockStore({}, exceptedActions, done);
    store.dispatch(actions.logout());
  });

  it('should dispatch LOGOUT_FAILURE after failure to log out', (done) => {
    nock(actions.AUTH_API)
      .post('/logout/')
      .reply(500, {
        'error': 'server error'
      });

    const exceptedActions = [
      { type: actions.LOGOUT_REQUEST },
      { type: actions.LOGOUT_FAILURE, error: Error() }
    ];

    const store = mockStore({}, exceptedActions, done);
    store.dispatch(actions.logout());
  });
});
