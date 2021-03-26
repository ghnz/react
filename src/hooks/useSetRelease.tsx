import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setReleaseCountries, setReleaseFiles, setReleaseInfo, setSelectedRelease } from "redux/reducers/release.slice.reducer";
import { fetchReleaseCountries, fetchReleaseFiles, fetchReleaseInfo } from "services";
import Release from "types/Release";

const useSetRelease = () => {
	const dispatch = useDispatch();

	const setRelease = useCallback((release: Release | undefined, isAdmin: boolean) => {
		dispatch(setSelectedRelease(release));
		if (release) {
			dispatch(fetchReleaseInfo(release));
			dispatch(fetchReleaseFiles(release.releaseId));
			if(isAdmin) {
				dispatch(fetchReleaseCountries(release))
			}
		} else {
			dispatch(setReleaseInfo(undefined));
			dispatch(setReleaseFiles(undefined));
			if(isAdmin) {
				dispatch(setReleaseCountries([]))
			}
		}
	}, [dispatch]);

	return setRelease;
}

export default useSetRelease;