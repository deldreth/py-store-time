import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import appReducer from '../reducers/app';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  createLogger()
)(createStore);

export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(appReducer, initialState);

  return store;
}
