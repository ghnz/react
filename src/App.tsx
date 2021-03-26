import React, { FC } from 'react';
import { Route, Switch } from "react-router";
import { Provider } from 'react-redux';
import appStore from 'redux/store/appStore';
import DefaultLayout from 'layouts/Index';
import "./i18n";
import { HashRouter } from 'react-router-dom';
import PrductsWrapper from 'components/products-wrapper/ProductsWrapper'
import { AuthWrapper } from 'components/auth';
import GlobalStyle from "./App.styles";

const AppRoot: FC = () => {

  return (
    <React.Fragment>
      <GlobalStyle />
      <AuthWrapper>
        <Provider store={appStore}>
          <PrductsWrapper>
            <HashRouter>
              <Switch>
                <Route path={'/'} component={DefaultLayout} exact={false} />
              </Switch>
            </HashRouter>
          </PrductsWrapper>
        </Provider>
      </AuthWrapper>
    </React.Fragment>
  );
}

export default AppRoot;


