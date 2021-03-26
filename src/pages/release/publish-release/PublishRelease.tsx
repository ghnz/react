import { ContentSpinner } from "components/spinners";
import React, { FC } from "react"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import * as styles from "./PublishRelease.style";

interface CheckListItem {
	label: string;
	route: string;
	errors?: string[];
}

const PublishRelease: FC = () => {
	const release = useSelector((state: RootState) => state.release.selectedRelease);
	const { t } = useTranslation();

	if (!release) {
		return <ContentSpinner />;
	}

	return <styles.ReleasePublishedStyle className="fpds-Container fpds-Container--narrow u-paddingNone u-backgroundCanvas u-minHeightFull u-flex u-flexColumn">
		<div className="fpds-Header u-marginBottomSmall u-flexInitial">
			<div className="fpds-Header-header">
				<div className="fpds-Header-heading fpds-Heading--medium">
					<span>{release.name} {release.version}</span>
				</div>
			</div>
		</div>

		<div className="u-flex u-flexFill u-minWidthFull u-alignCenter">
			<div className="u-textCenter">

				<div className="u-flex u-justifyCenter"><div className="fpds-ProgressSpinner fpds-ProgressSpinner--large"></div></div>

				<div className="u-marginTopLarge fpds-Header-heading fpds-Heading--small">{t("pages.publish-release.publishing")}</div>

				<div className="u-marginTopMedium">
					<div>{t("pages.publish-release.description-1")}</div>
					<div className="u-marginTopMedium">{t("pages.publish-release.description-2")}</div>
				</div>

			</div>
		</div>
	</styles.ReleasePublishedStyle>;
}

export default PublishRelease;
