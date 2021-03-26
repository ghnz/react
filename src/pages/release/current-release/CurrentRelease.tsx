import DownloadReleaseButton from 'components/download-release-button/DownloadReleaseButton';
import { ContentSpinner } from 'components/spinners';
import ReleaseHeader from 'components/view-release/ReleaseHeader';
import ViewRelease from 'components/view-release/ViewRelease';
import useErrorHandler from 'hooks/useErrorHandler';
import useSetRelease from 'hooks/useSetRelease';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { ErrorType } from 'redux/reducers/error.slice.reducer';


const CurrentRelease: FC = () => {

	const releases = useSelector((state: RootState) => state.release.releases);
	const release = useSelector((state: RootState) => state.release.selectedRelease);
	const releaseFiles = useSelector((state: RootState) => state.release.releaseFiles);
	const releaseInfo = useSelector((state: RootState) => state.release.releaseInfo);
	const dispatch = useDispatch();
	const { raiseError } = useErrorHandler();

	const setRelease = useSetRelease();

	useEffect(() => {

		if (releases) {
			const r = releases.find(r => r.isCurrent);
			if (r) {
				setRelease(r, false);
			} else {
				raiseError(ErrorType.NotFound);
			}
		} else {
			setRelease(undefined, false);
		}

		return () => {
			setRelease(undefined, false);
		}
	}, [releases, raiseError, dispatch, setRelease])

	if(!release) {
		return <ContentSpinner />
	}

	return <React.Fragment>
		<ReleaseHeader release={release}><DownloadReleaseButton release={release} files={releaseFiles} /></ReleaseHeader>
		<ViewRelease release={release} files={releaseFiles} info={releaseInfo} />
	</React.Fragment>;
}

export default CurrentRelease;