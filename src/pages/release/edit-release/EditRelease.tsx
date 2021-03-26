import { Card, CardSection } from "components/card";
import { DateTime } from "components/fphc-date";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "redux/reducers";
import Routes from "router/Routes";
import Route from "types/Route";
import BackTo from 'components/back-to/BackTo';
import EditReleaseNameButton from './EditReleaseNameButton';
import * as styles from './EditRelease.styles';
import ReleaseUpdated from 'components/release-updated/ReleaseUpdated';
import { fetchCountries } from '../../../redux/reducers/region.slice.reducer';
import ReviewAndPublishButton from "./ReviewAndPublishButton";
import useDraftView from "hooks/useDraftView";
import SaveChangesPrompt from "./SaveChangesPrompt";
import ReleaseMenu from "../release-detail/ReleaseMenu";
import ReleaseState from "enums/ReleaseState";
import ReleasePublished from "../release-published/ReleasePublished";
import { ContentSpinner } from "components/spinners";
import { Trans, useTranslation } from "react-i18next";
import useReleaseForm from "hooks/useReleaseForm";

interface EditReleaseProps {
	routes: Route[]
}

const EditRelease: FC<EditReleaseProps> = (props) => {

	useDraftView();

	const { release, pristine, invalid, submitting, performSubmit, performReset } = useReleaseForm();
	const regions = useSelector((state: RootState) => state.region.regions);

	const dispatch = useDispatch();
	const { t } = useTranslation();

	useEffect(() => {
		if (!regions) {
			dispatch(fetchCountries());
		}
	}, [dispatch, regions]);

	if (!release) {
		return <ContentSpinner />
	}

	if (release.status === ReleaseState.published) {
		return <ReleasePublished />
	}

	return (
		<styles.EditRelease>
			<SaveChangesPrompt pristine={pristine} save={performSubmit} discard={performReset} />
			<BackTo route={`/${release.productId}/draft-releases`}>{t("pages.edit-release.back-to")}</BackTo>
			<div className="fpds-Header u-marginBottomLarge">
				<div className="fpds-Header-header u-flex">
					<div className="u-flexInitial">
						<div className="fpds-Header-heading fpds-Heading--medium">
							<span>{release.name} {release.version}</span>
							<span className="u-marginLeftMedium"><EditReleaseNameButton initialValues={release} /></span>
						</div>

					</div>
					<div className="u-flexFill">
						<div className="fpds-Flow u-justifyEnd fpds-Flow--xSmall">
							{!pristine &&
								<React.Fragment>
									<span className="unsavedChanges">{t("pages.edit-release.unsaved-changes")}</span>
									<button type="button"
										className="fpds-Button fpds-Button fpds-Button--subtleDanger"
										onClick={performReset}
										disabled={submitting}
									>
										<span>{t("pages.edit-release.actions.discard")}</span>
									</button>
								</React.Fragment>
							}
								<button type="button"
									className="fpds-Button fpds-Button"
									onClick={performSubmit}
									disabled={pristine || invalid || submitting}>
									<span>{t("pages.edit-release.actions.save")}</span>
									{submitting &&
										<div className="fpds-Button-iconEnd" >
											<div className="fpds-ProgressSpinner fpds-ProgressSpinner--small"></div>
										</div>
									}
								</button>
							<ReviewAndPublishButton />
							<div className="u-inlineBlock"><ReleaseMenu release={release} isEdit={true} /></div>
						</div>
					</div>
				</div>
				<div className="fpds-Header-metadata u-flex">
					<div className="fpds-Header-metadataItem u-flexInitial">
						<div className="fpds-Label fpds-Label--warning">{t("pages.edit-release.detail.state")}</div>
						<label className="u-fontNormal fpds-Header-metadataLabel u-marginLeftMedium">{release.createdBy}</label>
						<label className="u-fontNormal fpds-Header-metadataLabel u-marginLeftSmall"><Trans i18nKey="pages.edit-release.detail.created" components={[<DateTime date={release.createdOn} />]} /></label>
					</div>
					<div className="u-flexFill"><div className="fpds-Header-metadataLabel u-floatRight"><Trans i18nKey="pages.edit-release.detail.updated" components={[<ReleaseUpdated />]} /></div></div>
				</div>
				<div className="fpds-Header-toolbar">
					<ul className="fpds-Tabs">
						<li className="fpds-Tabs-item">
							<NavLink
								className="fpds-Tabs-itemOption"
								activeClassName="is-selected"
								to={`/${release.productId}/draft-releases/${release.releaseId}`}
								exact={true}
							>
								{t("pages.edit-release.tabs.release-information")}
							</NavLink>
						</li>
						<li className="fpds-Tabs-item">
							<NavLink
								className="fpds-Tabs-itemOption"
								activeClassName="is-selected"
								to={`/${release.productId}/draft-releases/${release.releaseId}/files`}
								exact={true}
							>
								{t("pages.edit-release.tabs.files")}
							</NavLink>
						</li>
						<li className="fpds-Tabs-item">
							<NavLink
								className="fpds-Tabs-itemOption"
								activeClassName="is-selected"
								to={`/${release.productId}/draft-releases/${release.releaseId}/validate-upload`}
								exact={true}
							>
								{t("pages.edit-release.tabs.validate-upload")}
							</NavLink>
						</li>
						<li className="fpds-Tabs-item">
							<NavLink
								className="fpds-Tabs-itemOption"
								activeClassName="is-selected"
								to={`/${release.productId}/draft-releases/${release.releaseId}/regional-distribution`}
								exact={true}
							>
								{t("pages.edit-release.tabs.regional-distribution")}
							</NavLink>
						</li>
					</ul>
				</div>
			</div>

			<Card>
				{submitting &&
					<div className="spinnerOverlay">
						<div className="u-flex u-justifyCenter u-minHeightFull u-minWidthFull u-alignCenter">
							<div className="fpds-ProgressSpinner"></div>
						</div>
					</div>}
				<CardSection>
					<Routes routes={props.routes} />
				</CardSection>
			</Card>

		</styles.EditRelease>
	);
}

export default EditRelease;