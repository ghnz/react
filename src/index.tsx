// This must be the first line in src/index.js
import "react-app-polyfill/ie9";
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import AppRoot from './App';
import * as serviceWorker from './serviceWorker';
import history from "router/history";


const onRedirectCallback = (appState: any) => {
  history.push(
    appState && appState.returnTo
      ? appState.returnTo
      : window.location.pathname
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      audience={process.env.REACT_APP_AUDIENCE as string}
      redirectUri={`${window.location.origin}${window.location.pathname}`}
      onRedirectCallback={onRedirectCallback}
    >
      <AppRoot />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
