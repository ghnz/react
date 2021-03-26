import { matchPath } from 'react-router-dom';
import { RootState } from 'redux/reducers';
import BreadCrumb from 'types/BreadCrumb';
import Route from 'types/Route';

/**
 * @param  {Route[]} routes
 * @returns IRoute
 * Flattens nested routes
 */
export function getFlattenRoutes(routes: Route[]): Route[] {

  const newRoutes: Route[] = [];
  traverseRoutes(routes);

  function traverseRoutes(routes: Route[]) {
    routes.forEach((route: Route) => {
      newRoutes.push({...route});
      if (route.routes) {
        traverseRoutes(route.routes);
      };
    });
  };

  return newRoutes;
}

/**
 * @param  {Route} route
 * @param  {RootState} store
 * @param  {any} params
 * @returns Breadcrumb
 * Returns a breadCrumb given a given route. 
 */
export function getBreadCrumb(route: Route, store: RootState, params: any, currentUrl: string): BreadCrumb | null {
  const breadcrumb = route.breadcrumb;
  if (breadcrumb) {
    if (breadcrumb instanceof Function) {
      return { path: route.path, text: breadcrumb(params, store, currentUrl), label: route.label || false } as BreadCrumb;
    };
    if (typeof breadcrumb === 'string') return { path: route.path, text: route.breadcrumb } as BreadCrumb;
  }
  return null
}

/**
 * @param  {Route[]} routes
 * @param  {string} currentUrl
 * @returns any
 * Given current url return whether url matches any in routes config
 */
export function getMatchedPath(routes: Route[], currentUrl: string): any {
  let matchFound: any = null;
  for (let i = 0; i < routes.length; i++) {
    const pathDefinition = routes[i].path;
    const matchResult = matchPath(currentUrl, {
      path: pathDefinition,
      exact: true,
      strict: true
    });
    if (matchResult) {
      matchFound = matchResult;
      break;
    }
  };
  return matchFound;
}