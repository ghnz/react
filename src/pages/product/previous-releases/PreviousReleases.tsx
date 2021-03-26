import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { ReleaseList } from 'components/release-list';
import * as style from './PreviousReleases.style';
import { useTranslation } from 'react-i18next';


const PreviousReleases: FC = () => {

  const currentProductId = useSelector((state: RootState) => state.product.currentProduct?.productId) || "";
  const { t } = useTranslation();

  return <style.PreviousReleases>
    <div className="fpds-Header">
      <div className="fpds-Header-header">
        <div className="fpds-Header-heading fpds-Heading--medium">{t("pages.previous-releases.heading")}</div>
      </div>
    </div>

    <ReleaseList
      parentRoute={`/${currentProductId}/previous-releases`}
      excludeCurrent={true} />

  </style.PreviousReleases>;
}

export default PreviousReleases;