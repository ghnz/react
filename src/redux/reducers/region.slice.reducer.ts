import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Region } from 'types/Region';
import { api, urls } from "../../api";
import RegionCountry from "types/RegionCountry";

type RegionState = {
    regions: Region[] | undefined
};

const initialState: RegionState = {
	regions: undefined
};

const regionSlice = createSlice({
    name: 'region',
    initialState: initialState,
    reducers: {
        setRegions: (state, action: PayloadAction<RegionCountry[] | undefined>) => {

			const regions: Region[] = [];

			action.payload?.forEach(c => {
				let region = regions.find(r => r.name === c.regionName);
				if (!region) {
					region = { name: c.regionName, countries: [] };
					regions.push(region);
				}
				region.countries.push({ code: c.countryCode, name: c.countryName });
			});

            return {
                ...state,
                regions: regions
            }
        }
    }
});

export const fetchCountries = () => async (dispatch: Dispatch<any>) => {
    try {
		const response = await api.get(urls.getRegions());
		dispatch(setRegions(response.data));
    } catch (e) {
        return console.error(e.message);
    }
};

export const { setRegions } = regionSlice.actions;

export default regionSlice.reducer;
