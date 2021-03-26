import RoleType from 'enums/RoleType';
import { LazyExoticComponent, ComponentType, ReactNode } from 'react';

export default interface Route {
  path: string;
  exact: boolean;
  fallback?: NonNullable<ReactNode> | null;
  component?: LazyExoticComponent<ComponentType<any>>;
  routes?: Route[];
  redirect?: string | Function;
  protected?: boolean;
  breadcrumb?: string | Function;
  permission?: RoleType;
  label?: boolean;
};
