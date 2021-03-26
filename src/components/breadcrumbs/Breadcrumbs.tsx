import React, { FC, useEffect, useState, useCallback } from 'react';
import { useStore } from 'react-redux';
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router";
import BreadCrumb from 'types/BreadCrumb';
import { getBreadCrumb, getFlattenRoutes, getMatchedPath } from 'utils/Route';
import Route from 'types/Route';
import { routes } from 'router/route.config';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { Translation } from 'react-i18next';

const Breadcrumbs: FC = () => {

  const location = useLocation();
  const store = useStore();
  const [crumbs, setCrumbs] = useState<BreadCrumb[]>([]);
  const currentProduct = useSelector((state: RootState) => state.product.currentProduct);
  const currentRelease = useSelector((state: RootState) => state.release.selectedRelease);


  const buildBreadcrumbs = useCallback(
    () => {
      const currentUrl = location.pathname;
      // flattens application routes
      let flattenedRoutes: Route[] = getFlattenRoutes(routes);
      // try get a match based on route definition and current url. e.g  route definition: /test/:userId/123  will match /test/3/123
      const matchObject: any = getMatchedPath(flattenedRoutes, currentUrl);
      if(!matchObject) {
        setCrumbs([]);
        return;
      }
      const params: any = matchObject.params;
      // substitute param placeholder in route with actual values
      const filteredRoutes = flattenedRoutes.filter((route: Route) => {

        if (route.path?.length && matchObject.path.startsWith(route.path)) {
          Object.keys(params).forEach(key => { route.path = route.path.replace(`:${key}`, params[key]); });
          return true;
        }
        return false;
      });

      const breadcrumbs: BreadCrumb[] = [];

      for (let i = 0; i < filteredRoutes.length; i++) {
        const route = filteredRoutes[i];
        const breadcrumb: BreadCrumb | null = getBreadCrumb(route, store.getState(), params, currentUrl);
        if (breadcrumb) {
          breadcrumbs.push(breadcrumb);
        }
      };

      setCrumbs(breadcrumbs.filter(b => b.text && b.text.length > 0));
    },
    [location.pathname, store]
  )

  useEffect(() => {
    buildBreadcrumbs();
  }, [buildBreadcrumbs, currentProduct, currentRelease]);


  return <Translation>
    {(t) => (
      <React.Fragment>
        <ul className="fpds-Navbar-nav fpds-Breadcrumb">
          <li className="fpds-Breadcrumb-item">
            <NavLink
              className="fpds-Breadcrumb-itemOption"
              to="/"
              exact
            >{t("breadcrumbs.home")}</NavLink>
          </li>
          {
            crumbs.map((crumb, index) => {
              let bc;
              if (crumb.label) {
                bc = <span>{t(crumb.text)}</span>;
              } else {
                bc = <NavLink
                  className="fpds-Breadcrumb-itemOption"
                  to={crumb.path}
                  exact
                >
                  <span className="fpds-Breadcrumb-itemLabel">{t(crumb.text)}</span>
                </NavLink>
              }

              return (
                <li className="fpds-Breadcrumb-item" key={index}>
                  <span className="fpds-Breadcrumb-itemLabel">{bc}</span>
                </li>
              )
            })
          }
        </ul>
      </React.Fragment>
    )}
  </Translation>
}

export default Breadcrumbs