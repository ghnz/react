import { Dispatch } from "@reduxjs/toolkit";
import { api, urls } from "../api";
import NewRelease from "../types/NewRelease";
import ApiError from "../api/api-error";
import { setReleases, setSelectedRelease, setRelease } from "../redux/reducers/release.slice.reducer";
import Release from "../types/Release";

const fetchReleases = (productId: string) => async (dispatch: Dispatch<any>) => {
    try {
        const response = await api.get(urls.getReleases(productId));
        dispatch(setReleases(response.data));
        return response.data;
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const createRelease = async (newRelease: NewRelease): Promise<Release> => {
    try {
        const response = await api.post(urls.createRelease(), newRelease);
        return response.data.returnObject as Release;
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const updateRelease = (release: Release) => async (dispatch: Dispatch<any>) => {
    try {
        const { releaseId, version, name } = release;
        const response = await api.put(urls.updateRelease(release.releaseId), {
            releaseId,
            name,
            version,
        });
        dispatch(setRelease(release));
        dispatch(setSelectedRelease(release));
        return response.data.returnObject; 
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const archiveRelease = async (releaseId: string) => {
    try {
        await api.post(urls.archiveRelease(releaseId));
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
}

const publishRelease = async (releaseId: string) => {
    try {
        const response = await api.post(urls.publishRelease(releaseId));
        return response.data.returnObject;
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
}

const deleteRelease = async (releaseId: string) => {
    try {
        await api.delete(urls.deleteRelease(releaseId));
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
}
export { 
    fetchReleases, 
    createRelease, 
    updateRelease,
    publishRelease,
    archiveRelease,
    deleteRelease,
 };
