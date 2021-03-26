import React, { FC, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as style from "./Landing.style";
import { api, urls } from 'api';
import ProductRelease from 'types/ProductRelease';
import useNotification from 'hooks/useNotification';
import { NavLink } from 'react-router-dom';
import { ContentSpinner } from 'components/spinners';

interface VersionLinkParams {
  productId: string,
  version: string
}

const VersionLink: FC<VersionLinkParams> = ({ productId, version }) => {

  const { t } = useTranslation();

  return <NavLink
    className="fpds-Link"
    to={`${productId}/current-release`}
    exact
  >{t("pages.landing.new-release-available.version", { version })}</NavLink>;
}

const LandingPage: FC = () => {

  const [latestReleases, setLatestReleases] = useState<ProductRelease[] | undefined>();
  const [notificationRelease, setNotificationRelease] = useState<ProductRelease | undefined>();
  const { error } = useNotification();
  const { t } = useTranslation();


  const getLatestReleases = async () => {

    try {
      const response = await api.get(urls.getLatestReleases())
      setLatestReleases(response.data);
    } catch {
      error(t("pages.landing.errors.load-release"));
    }
  }

  function getCloseNotifications() {
    return JSON.parse(localStorage.getItem('closedNotifications') || '{}');
  }

  function setCloseNotifications(closedNotifications: any) {
    localStorage.setItem('closedNotifications', JSON.stringify(closedNotifications));
  }

  const onCloseNotification = () => {
    const closedNotifications = getCloseNotifications();
    closedNotifications[`landing_${notificationRelease?.releaseId}`] = true;
    setCloseNotifications(closedNotifications);
  }

  useEffect(() => {
    if (!latestReleases) {
      getLatestReleases();
    } else if (latestReleases.length) {
      const closedNotifications = getCloseNotifications();
      if (!closedNotifications[`landing_${latestReleases[0].releaseId}`]) {
        setNotificationRelease(latestReleases[0]);
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestReleases])

  if (!latestReleases) {
    return <ContentSpinner />
  }

  return <style.Landing>
    {notificationRelease &&
      <div className="fpds-Notification fpds-Notification--banner is-visible u-marginBottomXLarge">
        <i className="fpds-Notification-icon fpds-Icon fpds-Icon--medium">info</i>
        <div className="fpds-Notification-content">
          <div className="fpds-Notification-header">{t("pages.landing.new-release-available.header")}</div>
          <div className="fpds-Notification-body">
            <Trans
              i18nKey="pages.landing.new-release-available.body"
              values={{ productName: notificationRelease.productName }}
              components={[
                <VersionLink productId={notificationRelease.productId} version={notificationRelease.releaseVersion} />
            ]} />
          </div>
        </div>
        <button type="button" className="fpds-Notification-dismiss fpds-Button fpds-Button--subtle fpds-Button--icon" onClick={onCloseNotification}>
          <i className="fpds-Icon fpds-Icon--small">close</i>
        </button>
      </div>
    }
    <div className="fpds-Header">
      <div className="fpds-Header-header">
        <div className="fpds-Header-heading fpds-Heading--medium">{t("pages.landing.heading")}</div>
      </div>
    </div>

    <div className="fpds-Grid u-marginTopLarge">
      <div className="fpds-Column fpds-Column--4of12 fpds-Flow u-alignCenter">
        <div>
          <div className="fpds-Heading fpds-Heading--xLarge u-fontBold">{t("pages.landing.title")}</div>
          <div className="u-marginTopMedium u-textSecondary">{t("pages.landing.description")}</div>
        </div>
      </div>
      <div className="fpds-Column--8of12">
        <div className="u-widthAuto u-borderRadiusLarge u-backgroundWhite u-paddingLarge u-border" style={{ height: "260px" }}></div>
      </div>
    </div>

    <div className="fpds-Heading fpds-Heading--small u-marginTopLarge u-fontBold">{t("pages.landing.latest-releases.heading")}</div>

    <div className="fpds-Grid u-marginTopSmall">
      {latestReleases?.map(release => <div className="fpds-Column--4of12" key={release.releaseId}>
        <div className="fpds-Card" key={release.releaseId}>
          <div className="fpds-Heading fpds-Heading--bold fpds-Heading--small">{`${release.releaseName} ${release.releaseVersion}`}</div>
          <div className="u-marginTopMedium">{release.description}</div>
          <div className="fpds-Flow u-justifyContentEnd">
            <NavLink
              className="fpds-Button fpds-Button--primary u-marginTopLarge"
              to={`${release.productId}/current-release`}
              exact>{t("pages.landing.latest-releases.view-release")}</NavLink>
          </div>
        </div>
      </div>)}

    </div>

  </style.Landing>;
}

export default LandingPage;
