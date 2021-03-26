import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, useParams } from "react-router";
import { RootState } from "../../redux/reducers";
import Route from '../../types/Route';
import Routes from '../../router/Routes';
import useErrorHandler from "hooks/useErrorHandler";
import { ErrorType } from "redux/reducers/error.slice.reducer";
import useSetRelease from "hooks/useSetRelease";
import useProfile from "hooks/useProfile";

interface ReleaseRouterParams {
	releaseId: string;
}

interface ReleaseRootProps {
	routes: Route[]
}

const ReleaseRoot: FC<ReleaseRootProps> = ({ routes }) => {

	const releaseId = useParams<ReleaseRouterParams>().releaseId;
	const releases = useSelector((state: RootState) => state.release.releases);
	const { isAdmin } = useProfile();

	const dispatch = useDispatch();
	const { raiseError } = useErrorHandler();

	const setRelease = useSetRelease();
	
	useEffect(() => {

		if (releaseId && releases) {
			const release = releases.find(r => r.releaseId === releaseId);
			if (release) {
				setRelease(release, isAdmin);
			} else {
				raiseError(ErrorType.NotFound);
			}
		} else {
			setRelease(undefined, isAdmin);
		}

		return () => {
			setRelease(undefined, isAdmin);
		}
	}, [isAdmin, releaseId, releases, raiseError, dispatch, setRelease])

	return (
		<Switch>
			<Routes routes={routes} />
		</Switch>
	);
}

export default ReleaseRoot;