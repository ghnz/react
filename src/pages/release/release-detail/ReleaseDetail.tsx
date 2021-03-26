import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import ViewRelease from "components/view-release/ViewRelease";
import ReleaseHeader from "components/view-release/ReleaseHeader";
import DownloadReleaseButton from "components/download-release-button/DownloadReleaseButton";
import { ContentSpinner } from "components/spinners";
import BackTo from "components/back-to/BackTo";
import { useTranslation } from "react-i18next";

const ReleaseDetail: FC = () => {

	const { selectedRelease, releaseFiles, releaseInfo } = useSelector((state: RootState) => state.release);

	const { t } = useTranslation();

	if (!selectedRelease) {
		return <ContentSpinner />
	}

	return <React.Fragment>

		<BackTo route={`/${selectedRelease.productId}/previous-releases`} >{t("pages.release-detail.back-to-previous")}</BackTo>

		<ReleaseHeader release={selectedRelease}>
			{selectedRelease.isCurrent &&
				<DownloadReleaseButton release={selectedRelease} files={releaseFiles} />
			}
		</ReleaseHeader>
		<ViewRelease release={selectedRelease} files={releaseFiles} info={releaseInfo} />
	</React.Fragment>;
}

export default ReleaseDetail;