import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import * as actions from '../../actions/QueueActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('async queue actions ', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should dispatch QUEUE_UPDATE after creating a queue', (done) => {
    nock('http://127.0.0.1:8000/')
      .post('/api/queue/', {
        user: 'user'
      })
      .reply(200, {
        queue: []
      });

    const exceptedActions = [
      { type: actions.QUEUE_CREATE, user: 'user' },
      { type: actions.QUEUE_UPDATE, queue: [] }
    ];

    const store = mockStore({}, exceptedActions, done);
    store.dispatch(actions.create('user'));
  });
});
