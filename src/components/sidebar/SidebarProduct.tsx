import React, { useState, FC, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import Product from 'types/Product';
import * as style from './Sidebar.style';
import useProfile from 'hooks/useProfile';

interface SidebarProductParams {
  product: Product;
}

export const SidebarProduct: FC<SidebarProductParams> = (params) => {

  const { product } = params;
  const currentProductId = useSelector((state: RootState) => state.product.currentProduct?.productId);
  const [isOpen, setIsOpen] = useState(false);

  const { isAdmin } = useProfile();

  useEffect(() => {
    if (currentProductId === product.productId) {
      setIsOpen(true);
    }
  }, [currentProductId, product]);

  function toggleOpen() {
    setIsOpen(!isOpen);
  }

  return <li className="fpds-Nav-item">
    <button type="button" className={`fpds-Nav-itemGroup${isOpen ? " is-open" : ""}`} onClick={toggleOpen}><span className="fpds-Nav-itemLabel">{product.name}</span></button>
    {!isAdmin &&
      <ul className="fpds-Nav">
        <li className="fpds-Nav-item">
          <NavLink
            className="fpds-Nav-itemOption"
            activeClassName="is-selected"
            to={`/${product.productId}/current-release`}
          >
            <span className="fpds-Nav-itemLabel">Current release</span>
          </NavLink>
        </li>
        <li className="fpds-Nav-item">
          <NavLink
            className="fpds-Nav-itemOption"
            activeClassName="is-selected"
            to={`/${product.productId}/previous-releases`}
          >
            <span className="fpds-Nav-itemLabel">Previous releases</span>
          </NavLink>
        </li>
      </ul>
    }
    {isAdmin &&
      <ul className="fpds-Nav">
        <li className="fpds-Nav-item">
          <NavLink
            className="fpds-Nav-itemOption"
            activeClassName="is-selected"
            to={`/${product.productId}/all-releases`}
          >
            <span className="fpds-Nav-itemLabel">All releases</span>
          </NavLink>
        </li>
        <li className="fpds-Nav-item">
          <NavLink
            className="fpds-Nav-itemOption"
            activeClassName="is-selected"
            to={`/${product.productId}/draft-releases`}
          >
            <div className="fpds-Nav-itemLabel">
              <span>Draft releases</span>
              <style.DraftReleasesCount>{product.draftReleasesCount}</style.DraftReleasesCount>
            </div>
          </NavLink>
        </li>
      </ul>
    }
  </li>;
};
