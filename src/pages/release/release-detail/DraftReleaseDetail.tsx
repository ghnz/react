import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import ViewRelease from "components/view-release/ViewRelease";
import ReleaseHeader from "components/view-release/ReleaseHeader";
import ReleaseMenu from "./ReleaseMenu";
import useDraftView from "hooks/useDraftView";
import { ContentSpinner } from "components/spinners";
import ReleaseState from "enums/ReleaseState";
import ReleasePublished from "../release-published/ReleasePublished";
import DownloadReleaseButton from "components/download-release-button/DownloadReleaseButton";
import FileType from "enums/FileType";

const ReleaseDetail: FC = () => {

	const { selectedRelease, releaseFiles, releaseInfo, releaseCountries } = useSelector((state: RootState) => state.release);
	useDraftView();

	if (!selectedRelease) {
		return <ContentSpinner />
	}

	if (selectedRelease.status === ReleaseState.published) {
		return <ReleasePublished />
	}

	return <React.Fragment>
		<ReleaseHeader release={selectedRelease} isAdmin={true}>
			{releaseFiles?.find(f => f.fileType === FileType.firmware) &&
				<DownloadReleaseButton release={selectedRelease} files={releaseFiles} />
			}
			<div className="u-inlineBlock u-marginLeftMedium"><ReleaseMenu release={selectedRelease} /></div>
		</ReleaseHeader>
		<ViewRelease release={selectedRelease} files={releaseFiles} info={releaseInfo} countries={releaseCountries} />
	</React.Fragment>;
}

export default ReleaseDetail;