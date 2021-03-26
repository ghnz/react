import { ContentSpinner } from "components/spinners";
import React, { FC } from "react"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "redux/reducers";
import * as styles from "./ReleasePublished.style";

interface CheckListItem {
	label: string;
	route: string;
	errors?: string[];
}

const ReleasePublished: FC = () => {
	const release = useSelector((state: RootState) => state.release.selectedRelease);
	const history = useHistory();
	const { t } = useTranslation();

	if (!release) {
		return <ContentSpinner />;
	}

	const gotoRelease = () => {

		history.push(`/${release.productId}/all-releases/${release.releaseId}`)
	}

	const gotoAllReleases = () => {

		history.push(`/${release.productId}/all-releases`)
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

				<div><i className="fpds-Icon fpds-Icon--medium u-textSuccess">success</i></div>

				<div className="u-marginTopLarge fpds-Header-heading fpds-Heading--small">{t("pages.release-published.heading")}</div>

				<div className="u-marginTopMedium">
					<div>{t("pages.release-published.description-1")}</div>

					<div className="u-marginTopMedium">{t("pages.release-published.description-2")}</div>
				</div>


				<div className="buttons">
					<div className="u-marginTopXLarge">
						<button type="button" className="fpds-Button fpds-Button--primary u-minWidthFull" onClick={gotoRelease}>{t("pages.release-published.details-link")}</button>
					</div>

					<div className="u-marginTopXSmall">
						<button type="button" className="fpds-Button u-minWidthFull" onClick={gotoAllReleases}>{t("pages.release-published.view-releases")}</button>
					</div>
				</div>

			</div>
		</div>
	</styles.ReleasePublishedStyle>;
}

export default ReleasePublished;
