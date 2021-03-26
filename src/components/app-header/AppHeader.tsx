import React, { FC } from 'react';
import Breadcrumbs from 'components/breadcrumbs/Breadcrumbs';
import { Translation } from 'react-i18next';

const AppHeader: FC = () => {
  return <Translation>
    {(t) => (
      <nav className="fpds-Navbar">
        <div className="fpds-Navbar-brand is-fluid">
          <a className="fpds-Navbar-brandLink" href="#/">{t("header.app-name")}</a>
        </div>
        <Breadcrumbs />
      </nav>
    )}
  </Translation>
}

export default AppHeader;