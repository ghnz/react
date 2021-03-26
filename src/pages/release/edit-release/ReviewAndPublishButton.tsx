import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import { isPristine } from "redux-form";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ReviewAndPublishButton: FC = () => {

	const release = useSelector((state: RootState) => state.release.selectedRelease);
	const releaseFiles = useSelector((state: RootState) => state.release.releaseFiles);
	const releaseInfo = useSelector((state: RootState) => state.release.releaseInfo);
	const releaseCountries = useSelector((state: RootState) => state.release.releaseCountries);
	const currentTab = useSelector((state: RootState) => state.editRelease.currentTab);
	const pristine = useSelector((state: RootState) => isPristine(currentTab as string)(state));
	const { t } = useTranslation();
	const [canReview, setCanReview] = useState(false);

	useEffect(() => {

		setCanReview(
			(pristine
				// && release
				// && releaseFiles.find(f => f.fileType === "Firmware" && f.isChecksumValid === true)
				// && releaseCountries
				// && releaseCountries.length > 0
				// && releaseInfo
				// && releaseInfo.length > 0
				) ? true : false
		);

	}, [release, releaseFiles, releaseCountries, releaseInfo, pristine]);

	const history = useHistory();

	function review() {
		history.push(`/${release?.productId}/draft-releases/${release?.releaseId}/review`);
	}

	return <button type="button" className="fpds-Button fpds-Button--primary" disabled={!canReview} onClick={review}>
		<span>{t("pages.edit-release.actions.review-and-publish")}</span>
	</button>;
};

export default ReviewAndPublishButton;
