import { routerMiddleware } from 'connected-react-router';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from 'redux/reducers/index';
import browserHistory from 'router/history';

const middlewares = [routerMiddleware(browserHistory)];

/**
 * Creates a redux store
 */
const createStore = () => {

  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware(), ...middlewares],
    devTools: process.env.NODE_ENV !== 'production'
  });

  return store;
};

export default createStore;




