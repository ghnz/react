import { Dispatch } from "@reduxjs/toolkit";
import { api, urls } from "../api";
import ApiError from "../api/api-error";
import { setReleaseInfo, updateReleaseInfo } from "../redux/reducers/release.slice.reducer";
import Release from "../types/Release";
import ReleaseInfo from "../types/ReleaseInfo";

const fetchReleaseInfo = (release: Release) => async (dispatch: Dispatch<any>) => {
    try {
        const response = await api.get(urls.getReleaseInfo(release.releaseId));
        dispatch(setReleaseInfo(response.data));
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const saveReleaseInfo = (releaseInfo: ReleaseInfo) => async (dispatch: Dispatch<any>) => {
    try {
        if (releaseInfo.releaseInformationId) {
            await api.put(urls.updateReleaseInfo(releaseInfo.releaseId, releaseInfo.releaseInformationId), releaseInfo);
            dispatch(updateReleaseInfo({ ...releaseInfo }));
        } else {
            const response = await api.post(urls.createReleaseInfo(releaseInfo.releaseId), releaseInfo);
            dispatch(updateReleaseInfo({ ...releaseInfo, releaseInformationId: response.data.returnObject }));
        }
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};
export { fetchReleaseInfo, saveReleaseInfo };
