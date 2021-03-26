import { combineReducers } from '@reduxjs/toolkit';
import layoutReducer from './layout.slice.reducer';
import profileReducer from './profile.slice.reducer';
import productReducer from './product.slice.reducer';
import releaseReducer from './release.slice.reducer';
import editReleaseReducer from './edit-release.slice.reducer';
import languageReducer from './language.slice.reducer';
import regionReducer from './region.slice.reducer';
import notificationReducer from './notification.slice.reducer';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import browserHistory from 'router/history';
import errorReducer from './error.slice.reducer';

const rootReducer = combineReducers({
  layout: layoutReducer,
  profile: profileReducer,
  product: productReducer,
  release: releaseReducer,
  editRelease: editReleaseReducer,
  language: languageReducer,
  region: regionReducer,
  notification: notificationReducer,
  error: errorReducer,
  form: formReducer,
  router: connectRouter(browserHistory)
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>