import { Dispatch } from "@reduxjs/toolkit";
import { api, urls } from "../api";
import ApiError from "../api/api-error";
import { setReleaseCountries } from "../redux/reducers/release.slice.reducer";
import Release from "../types/Release";

const fetchReleaseCountries = (release: Release) => async (dispatch: Dispatch<any>) => {
    try {
        const response = await api.get(urls.getReleaseCountries(release.releaseId));
        dispatch(setReleaseCountries(response.data));
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const updateReleaseCountries = (releaseId: string, countries: string[]) => async (dispatch: Dispatch<any>) => {
    try {
        await api.post(urls.updateReleaseCountries(releaseId), { regionalDistributionList: countries });
        dispatch(setReleaseCountries(countries));
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

export { updateReleaseCountries, fetchReleaseCountries };