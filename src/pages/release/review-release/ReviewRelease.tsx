import { ApiErrors } from "components/api-errors";
import BackTo from "components/back-to/BackTo";
import { Card, CardSection, CardTable } from "components/card";
import { DateTime } from "components/fphc-date";
import ReleaseUpdated from "components/release-updated/ReleaseUpdated";
import { ContentSpinner } from "components/spinners";
import React, { FC, useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "redux/reducers";
import { fetchCountries } from "redux/reducers/region.slice.reducer";
import { publishRelease } from "services/release";
import { Region } from "types/Region";
import Release from "types/Release";
import ReleaseFile from "types/ReleaseFile";
import ReleaseInfo from "types/ReleaseInfo";
import { bytesToSize } from "utils/functions";
import LanguageLabels from "./LanguageLabels";
import RegionalDistributionSection from "./RegionalDistributionSection";
import PublishRelease from '../publish-release/PublishRelease';
import ReleaseState from "enums/ReleaseState";
import ReleasePublished from "../release-published/ReleasePublished";
import { setRelease, setSelectedRelease } from "redux/reducers/release.slice.reducer";
import useCurrentProduct from "hooks/useCurrentProduct";
import { DEFAULT_CULTURE_CODE } from "utils/constants";
import { Trans, useTranslation } from "react-i18next";
import * as style from "./ReviewRelease.style";
import FileType from "enums/FileType";

interface CheckListItem {
	label: string;
	route: string;
	errors?: string[];
}

const ReviewRealese: FC = () => {
	const release = useSelector((state: RootState) => state.release.selectedRelease);
	const files = useSelector((state: RootState) => state.release.releaseFiles);
	const info = useSelector((state: RootState) => state.release.releaseInfo);
	const countries = useSelector((state: RootState) => state.release.releaseCountries);
	const allRegions = useSelector((state: RootState) => state.region.regions);
	const [regions, setRegions] = useState<Region[]>();
	const [errors, setErrors] = useState<string[]>([]);
	const [defaultInfo, setDefaultInfo] = useState<ReleaseInfo>();
	const { t } = useTranslation();
	const [canPublish, setCanPublish] = useState(false);
	const [checkListItems, setCheckListItems] = useState<CheckListItem[]>([]);

	const addError = useCallback((item: CheckListItem, error: string) => {
		item.errors = item.errors || [];
		item.errors.push(error);
	}, []);

	const createRegionalDistributionSummary = useCallback((release: Release, countries: string[]) => {
		const regionalDistribution = {
			label: t("pages.review-release.regional-distribution.title"),
			route: `/${release.productId}/draft-releases/${release.releaseId}/regional-distribution`,
		};

		if (!countries || countries.length === 0) {
			addError(regionalDistribution, t("pages.review-release.errors.no-countries"));
		}
		return regionalDistribution;
	}, [t, addError]);

	const createValidateUploadSummary = useCallback((release: Release, files: ReleaseFile[]) => {
		const validateUpload = {
			label: t("pages.review-release.validate-upload.title"),
			route: `/${release.productId}/draft-releases/${release.releaseId}/validate-upload`,
		};

		const firmware = files.find(f => f.fileType === "Firmware");
		if (!firmware) {
			addError(validateUpload, t("pages.review-release.errors.no-firmware"));
		} else if (firmware.isChecksumValid !== true) {
			addError(validateUpload, t("pages.review-release.errors.not-validated"));
		}
		return validateUpload;
	}, [t, addError]);

	const createFileSummary = useCallback((release: Release, files: ReleaseFile[]) => {
		const filesItem = {
			label: t("pages.review-release.files.title"),
			route: `/${release.productId}/draft-releases/${release.releaseId}/files`,
		};

		if (files.find(f => !f.fileType || (f.fileType !== FileType.firmware && (!f.cultureCodes || f.cultureCodes.length === 0)))) {
			addError(filesItem, t("pages.review-release.errors.file-type-or-language"));
		}
		if (!files.find(f => f.fileType === "Firmware")) {
			addError(filesItem, t("pages.review-release.errors.no-firmware"));
		}
		if (files.filter(f => f.fileType === "Firmware").length > 1) {
			addError(filesItem, t("pages.review-release.errors.multiple-firmware-files"));
		}
		return filesItem;
	}, [t, addError]);

	const createReleaseInformationSummary = useCallback((release: Release, info: ReleaseInfo[] | undefined) => {
		const releaseInformation = {
			label: t("pages.review-release.release-information.title"),
			route: `/${release.productId}/draft-releases/${release.releaseId}`,
		};

		if (!info || info.length === 0) {
			addError(releaseInformation, t("pages.review-release.errors.no-release-information"));
		}

		if (info && info.find(i => !i.description || !i.description.length || !i.whatsNew || !i.whatsNew.length)) {
			addError(releaseInformation, t("pages.review-release.errors.invalid-release-information"));
		}
		return releaseInformation;
	}, [t, addError]);

	const dispatch = useDispatch()
	useEffect(() => {
		if (!allRegions || !allRegions.length) {
			dispatch(fetchCountries());
		} else {
			setRegions(allRegions
				.map(r => {
					return {
						...r,
						countries: r.countries.filter(c => countries.find(c1 => c1 === c.code))
					};
				}).filter(r => r.countries.length))
		}
	}, [dispatch, allRegions, countries]);

	useEffect(() => {
		if (release) {
			const items: CheckListItem[] = [];

			const releaseInformation = createReleaseInformationSummary(release, info);
			items.push(releaseInformation);

			const filesItem = createFileSummary(release, files || []);
			items.push(filesItem);

			const validateUpload = createValidateUploadSummary(release, files || []);
			items.push(validateUpload);

			const regionalDistribution = createRegionalDistributionSummary(release, countries);
			items.push(regionalDistribution);

			setCheckListItems(items);

			setCanPublish(items.find(i => i.errors && i.errors.length) ? false : true);
		}

		if (info) {
			setDefaultInfo(info.find(i => i.cultureCode === DEFAULT_CULTURE_CODE));
		}
	}, [release, files, info, countries, createFileSummary, createRegionalDistributionSummary, createReleaseInformationSummary, createValidateUploadSummary]);

	const [publishing, setPublishing] = useState(false);
	const { afterReleasePublish } = useCurrentProduct();

	if (!release) {
		return <ContentSpinner />;
	}

	const publish = async () => {
		setPublishing(true);
		setErrors([]);
		try {
			const updatedRelease = await publishRelease(release.releaseId);
			dispatch(setRelease(updatedRelease));
			dispatch(setSelectedRelease(updatedRelease));
			afterReleasePublish();
		}
		catch (e) {
			setErrors(e.errors);
		} finally {
			setPublishing(false);
		}
	}

	if (!release || !regions || !files || !countries || !info) {
		return <ContentSpinner />
	}

	if (publishing) {
		return <PublishRelease />
	}

	if (release.status === ReleaseState.published) {
		return <ReleasePublished />
	}

	return <style.ReviewRelease>

		<BackTo route={`/${release.productId}/draft-releases/${release.releaseId}`}>{t("pages.review-release.back-link")}</BackTo>
		<div className="fpds-Header u-marginBottomLarge">
			<div className="fpds-Header-header u-flex">
				<div className="u-flexInitial">
					<div className="fpds-Header-heading fpds-Heading--medium">
						<span>{release.name} {release.version}</span>
					</div>
				</div>
				<div className="u-flexFill">
					<div className="u-justifyEnd fpds-Flow fpds-Flow--xSmall">
						<NavLink
							className="fpds-Button"
							to={`/${release.productId}/draft-releases/${release.releaseId}`}
							exact={true}>
							<span>{t("pages.review-release.edit-release")}</span>
						</NavLink>
						<button type="button" className="fpds-Button fpds-Button--primary" disabled={!canPublish} onClick={publish}>
							<span>{t("pages.review-release.publish-release")}</span>
							{publishing && <div className="fpds-Button-iconEnd">
								<div className="fpds-ProgressSpinner fpds-ProgressSpinner--small fpds-ProgressSpinner--light"></div>
							</div>}
						</button>
					</div>
				</div>
			</div>

			<div className="fpds-Header-metadata u-flex">
				<div className="fpds-Header-metadataItem u-flexInitial">
					<div className="fpds-Label fpds-Label--warning">{t("pages.review-release.draft")}</div>
					<label className="fpds-Header-metadataLabel u-marginLeftMedium">{release.createdBy}</label>
					<label className="fpds-Header-metadataLabel u-marginLeftSmall"><Trans i18nKey="pages.review-release.created" components={[<DateTime date={release.createdOn} />]} /></label>
				</div>
				<div className="u-flexFill"><div className="fpds-Header-metadataLabel u-floatRight"><Trans i18nKey="pages.review-release.updated" components={[<ReleaseUpdated />]} /></div></div>
			</div>
		</div>

		<Card>
			<CardSection>
				<div className="fpds-Header-header">
					<div className="fpds-Heading fpds-Heading--bold fpds-Heading--small">{t("pages.review-release.checklist.title")}</div>
				</div>

				<ApiErrors errors={errors}
					singleHeader="An error occured when publishing the release"
					pluralHeader="Multiple errors occured publishing the release" />

				<div className="u-marginTopLarge fpds-Stack fpds-Stack--large">
					{checkListItems.map((item, index) => {
						if (item.errors) {
							return <div className="fpds-Flow" key={index}>
								<i className="fpds-Icon fpds-Icon--medium is-iconStart u-textWarning">warning</i>
								<div>
									<div className="fontSlightlyBold">{item.label}</div>
									{item.errors.map((e, index) => <div className="u-marginTopXSmall" key={index}>{e}</div>)}
									<NavLink className="fpds-Link u-marginTopXSmall"
										exact={true}
										to={item.route}>{t("pages.review-release.reslove-link")}</NavLink>
								</div>
							</div>
						}

						return <div className="fpds-Flow" key={index}>
							<i className="fpds-Icon fpds-Icon--medium is-iconStart u-textSuccess">success</i>
							<span className="fontSlightlyBold">{item.label}</span>
						</div>;
					})}
				</div>
			</CardSection>
		</Card>

		<hr className="fpds-Divider u-marginTopLarge u-marginBottomLarge" />

		<div className="fpds-Heading fpds-Heading--small u-marginBottomMedium">{t("pages.review-release.release-summary.title")}</div>

		<div className="fpds-Grid">
			<div className="fpds-Column fpds-Column--8of12">
				<Card>
					<CardSection>

						<div className="fpds-Header-header u-flex">
							<div className="fpds-Heading fpds-Heading--bold fpds-Heading--small u-flexInitial">{t("pages.review-release.release-information.title")}</div>
							<div className="u-flexFill fpds-Body">
								<div className="u-floatRight"><NavLink
									className="fpds-Button fpds-Button--subtlePrimary"
									exact={true}
									to={`/${release.productId}/draft-releases/${release.releaseId}`}
								>{t("pages.review-release.release-information.link")}</NavLink></div>
							</div>
						</div>

						<div>
							<div className="fpds-Heading u-fontBold">{t("pages.review-release.release-information.description")}</div>
							<div className="u-marginTopMedium">
								{defaultInfo?.description}
							</div>

							<hr className="fpds-Divider" />

							<div className="fpds-Heading u-fontBold">{t("pages.review-release.release-information.whats-new")}</div>
							<div className="u-marginTopMedium">
								{defaultInfo?.whatsNew}
							</div>
						</div>

					</CardSection>
				</Card>
			</div>
			<div className="fpds-Column fpds-Column--4of12">
				<Card>
					<CardSection>
						<div className="fpds-Header-header u-flex">
							<div className="fpds-Heading fpds-Heading--bold fpds-Heading--small u-flexInitial">{t("pages.review-release.localization.title")}</div>
							<div className="u-flexFill fpds-Body">
								<div className="u-floatRight"><NavLink
									className="fpds-Button fpds-Button--subtlePrimary"
									exact={true}
									to={`/${release.productId}/draft-releases/${release.releaseId}`}
								>{t("pages.review-release.localization.link")}</NavLink></div>
							</div>
						</div>
						<div>
							<div className="fontSlightlyBold">{t("pages.review-release.localization.message")}</div>
							<div className="u-marginTopXSmall">
								{info.map((i, index) => <label className="fpds-Checkbox  countryCheckbox u-marginTopXSmall" key={index}>
									<i className="fpds-Icon is-iconStart u-textInfo">check</i>
									<div className="fpds-Checkbox-label"><LanguageLabels cultureCodes={[i.cultureCode]} /></div>
								</label>)}
							</div>
						</div>
					</CardSection>
				</Card>
			</div>
		</div>

		<div className="u-marginTopLarge">
			<Card>
				<CardSection>
					<div className="fpds-Header-header u-flex">
						<div className="fpds-Heading fpds-Heading--bold fpds-Heading--small u-flexInitial">{t("pages.review-release.files.title")}</div>
						<div className="u-flexFill fpds-Body">
							<div className="u-floatRight"><NavLink
								className="fpds-Button fpds-Button--subtlePrimary"
								exact={true}
								to={`/${release.productId}/draft-releases/${release.releaseId}/files`}
							>{t("pages.review-release.files.link")}</NavLink></div>
						</div>
					</div>
				</CardSection>
				<CardTable>
					<thead>
						<tr>
							<th>{t("pages.review-release.files.headers.name")}</th>
							<th>{t("pages.review-release.files.headers.size")}</th>
							<th>{t("pages.review-release.files.headers.type")}</th>
							<th>{t("pages.review-release.files.headers.languages")}</th>
						</tr>
					</thead>
					<tbody>
						{files.map((file, index) => <tr key={index}>
							<td>{file.fileName}</td>
							<td>{bytesToSize(file.fileSize)}</td>
							<td>{file.fileType}</td>
							<td><LanguageLabels cultureCodes={file.cultureCodes?.split(',')} /></td>
						</tr>
						)}
					</tbody>
				</CardTable>
			</Card>
		</div>

		<div className="u-marginTopLarge">
			<RegionalDistributionSection regions={regions} release={release} />
		</div>

	</style.ReviewRelease>;
}

export default ReviewRealese;
