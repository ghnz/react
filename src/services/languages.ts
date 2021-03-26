import { Dispatch } from "@reduxjs/toolkit";
import { api, urls } from "../api";
import ApiError from "../api/api-error";
import { setLanguages } from "../redux/reducers/language.slice.reducer";

const fetchLanguages = () => async (dispatch: Dispatch<any>) => {
    try {
        const response = await api.get(urls.getLanguages());
        const languages = response.data.map((l:any) => { return { 
            cultureCode: l.cultureCode, 
            name: l.displayName };
        });
        dispatch(setLanguages(languages));
        return languages;
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

export { fetchLanguages };
