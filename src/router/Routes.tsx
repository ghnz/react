import { NotFoundError, UnauthorizedError } from 'components/error-wrapper/ErrorWrapper';
import RoleType from 'enums/RoleType';
import useProfile from 'hooks/useProfile';
import React from 'react';
import { Route, Redirect, Switch, useParams } from 'react-router';
import { ErrorType } from 'redux/reducers/error.slice.reducer';
import RouteModel from '../types/Route';

type IProps = {
  routes: RouteModel[]
};

const Routes: React.FC<IProps> = ({ routes }) => {
  
  return (
    <Switch>
      {routes.map((route: RouteModel, index) => {
        return (
          <RouteWithSubRoutes key={index} {...route} />
        )
      })}
      <Route render={() => <NotFoundError error={ErrorType.NotFound} />} />
    </Switch>
  )
};

export const RouteWithSubRoutes = (route: RouteModel) => {

  const {isAdmin} = useProfile();
  const params = useParams();

  const checkPermission = (route: RouteModel) => {
    return !route.permission || isAdmin ||
      (!isAdmin && route.permission === RoleType.user) 
  }

  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={() => {
        if (route.redirect)
        {
          if(typeof route.redirect === "string" ) {
            return <Redirect to={route.redirect} />;
          } else {
            const redirect = route.redirect(params, isAdmin);
            return <Redirect to={redirect} />;
          }
        }
        if(!checkPermission(route)) return <UnauthorizedError error={ErrorType.Forbidden} />

        if(route.component) {
          return <route.component routes={route.routes}/>;
        }
      }}
    />
  );
}

export default Routes;