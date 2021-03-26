import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import ViewRelease from "components/view-release/ViewRelease";
import ReleaseHeader from "components/view-release/ReleaseHeader";
import ReleaseMenu from "./ReleaseMenu";
import { ContentSpinner } from "components/spinners";
import DownloadReleaseButton from "components/download-release-button/DownloadReleaseButton";
import BackTo from "components/back-to/BackTo";
import { useTranslation } from "react-i18next";

const ReleaseDetail: FC = () => {

	const { selectedRelease, releaseFiles, releaseInfo, releaseCountries } = useSelector((state: RootState) => state.release);

	const { t } = useTranslation();

	if (!selectedRelease) {
		return <ContentSpinner />
	}

	return <React.Fragment>
		<BackTo route={`/${selectedRelease.productId}/all-releases`} >{t("pages.release-detail.back-to-all-releases")}</BackTo>
		<ReleaseHeader release={selectedRelease} isAdmin={true}>
			<DownloadReleaseButton release={selectedRelease} files={releaseFiles} />
			<div className="u-inlineBlock u-marginLeftXSmall"><ReleaseMenu release={selectedRelease} /></div>
		</ReleaseHeader>
		<ViewRelease release={selectedRelease} files={releaseFiles} info={releaseInfo} countries={releaseCountries} />
	</React.Fragment>;
}

export default ReleaseDetail;