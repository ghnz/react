import React, { FC } from 'react';
import * as style from './DraftReleases.style';
import { ReleaseList } from '../../../components/release-list';
import { NewReleaseButton } from 'components/new-release-button';
import ReleaseState from 'enums/ReleaseState';
import OnBoarding from './OnBoarding';
import useDraftView from 'hooks/useDraftView';
import { useTranslation } from 'react-i18next';


const DraftReleases: FC = () => {

  const { productId, draftReleases, hasViewedDrafts } = useDraftView();
  const { t } = useTranslation();

  return (
    <style.DraftReleases>
      <div className="fpds-Header">
        <div className="fpds-Header-header u-flex">
          <div className="u-flexInitial">
            <div className="fpds-Header-heading fpds-Heading--medium">{t("pages.draft-releases.heading")}</div>
          </div>
          <div className="u-flexFill">
            <div className="u-floatRight">
              <NewReleaseButton />
            </div>
          </div>
        </div>
      </div>

      {(draftReleases?.length || hasViewedDrafts) &&
        <ReleaseList
          isAdmin={true}
          releaseState={ReleaseState.draft}
          parentRoute={`/${productId}/draft-releases`}
        />
      }
      {draftReleases && !draftReleases.length && !hasViewedDrafts &&
        <OnBoarding />
      }
    </style.DraftReleases>
  );
}


export default DraftReleases;