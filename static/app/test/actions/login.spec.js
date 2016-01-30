import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import * as actions from '../../actions/UserActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('async login action', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should dispatch LOGIN_SUCCESS after logging in', (done) => {
    nock('http://127.0.0.1:8000')
      .post('/rest-auth/login/', {
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
    nock('http://127.0.0.1:8000')
      .post('/rest-auth/login/', {
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
});
