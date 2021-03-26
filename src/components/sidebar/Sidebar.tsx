import useProfile from 'hooks/useProfile';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarProducts } from './SidebarProducts';

const Sidebar: FC = () => {

  const { isAdmin } = useProfile();
  
  return (
    <nav className="fpds-Sidebar u-backgroundWhite">
      <ul className="fpds-Nav">
        <SidebarProducts />
        {isAdmin &&
          <li className="fpds-Nav-item">
            <NavLink
              className="fpds-Nav-itemOption"
              activeClassName="is-selected"
              to={`/reports`}
              exact
            ><span className="fpds-Nav-itemLabel">Reports</span></NavLink>
          </li>
        }
        {!isAdmin &&
          <li className="fpds-Nav-item">
            <NavLink
              className="fpds-Nav-itemOption"
              activeClassName="is-selected"
              to={`/download-log`}
              exact
            ><span className="fpds-Nav-itemLabel">Download log</span></NavLink>
          </li>
        }                
      </ul>
    </nav>
  );
}

export default Sidebar;

