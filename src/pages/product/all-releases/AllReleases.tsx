import React, { FC } from 'react';
import * as style from './AllReleases.style';
import { ReleaseList } from '../../../components/release-list';
import { NewReleaseButton } from '../../../components/new-release-button';
import { NavLink, useLocation } from 'react-router-dom';
import ReleaseState from '../../../enums/ReleaseState';
import OnBoarding from './OnBoarding';
import useReleasedView from 'hooks/useReleasedView';
import { useTranslation } from 'react-i18next';

const AllReleases: FC = () => {

	const { productId, releases, hasViewedReleases } = useReleasedView();
	const location = useLocation();
	const releaseState = location.pathname.indexOf(`/${productId}/all-releases/archived`) === 0 ? ReleaseState.archived : ReleaseState.published;
	const { t } = useTranslation();

	return (
		<style.AllReleases>
			<div className="fpds-Header">
				<div className="fpds-Header-header u-flex">
					<div className="u-flexInitial">
						<div className="fpds-Header-heading fpds-Heading--medium">{t("pages.all-releases.heading")}</div>
					</div>
					<div className="u-flexFill">
						<div className="u-floatRight">
							<NewReleaseButton />
						</div>
					</div>
				</div>
				{((releases && releases.length) || hasViewedReleases) &&
					<ul className="fpds-Tabs u-backgroundCanvas">

						<li className="fpds-Tabs-item">
							<NavLink
								className="fpds-Tabs-itemOption"
								activeClassName="is-selected"
								to={`/${productId}/all-releases`}
								exact={true}
							>{t("pages.all-releases.tabs.published")}</NavLink>
						</li>
						<li className="fpds-Tabs-item">
							<NavLink
								className="fpds-Tabs-itemOption"
								activeClassName="is-selected"
								to={`/${productId}/all-releases/archived`}
								exact={true}
							>{t("pages.all-releases.tabs.archived")}</NavLink>
						</li>
					</ul>
				}
			</div>

			{((releases && releases.length) || hasViewedReleases) &&
				<ReleaseList
					isAdmin={true}
					parentRoute={location.pathname}
					releaseState={releaseState}
				/>
			}
			{releases && !releases.length && !hasViewedReleases &&
				<OnBoarding />
			}
		</style.AllReleases>
	);
}

export default AllReleases;
