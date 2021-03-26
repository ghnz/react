import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ReleaseState from "enums/ReleaseState";
import Release from "types/Release";
import ReleaseFile from "types/ReleaseFile";
import ReleaseInfo from "types/ReleaseInfo";
import { compareReleaseDates } from "utils/functions";

interface ReleaseSliceState {
    selectedRelease?: Release;
    releases?: Release[];
    releaseFiles?: ReleaseFile[];
    releaseInfo?: ReleaseInfo[];
    releaseCountries: string[];
}

const initialState: ReleaseSliceState = {
    releases: undefined,
    releaseCountries: [],
};

const releaseSlice = createSlice({
    name: "release",
    initialState: initialState,
    reducers: {
        setReleases: (state, action: PayloadAction<Release[] | undefined>) => {
            if (action.payload) {
                const releases = [...action.payload].sort((a, b) =>
                    compareReleaseDates(new Date(a.modifiedOn), new Date(b.modifiedOn)),
                );

                const currentRelease = releases.filter((r) => r.status === ReleaseState.published).find((a) => true);

                if (currentRelease) {
                    currentRelease.isCurrent = true;
                }

                return {
                    ...state,
                    releases,
                };
            }
            return { ...state, releases: undefined };
        },
        setSelectedRelease: (state, action: PayloadAction<Release | undefined>) => {
            return {
                ...state,
                selectedRelease: action.payload,
            };
        },
        addRelease: (state, action: PayloadAction<Release>) => {
            return {
                ...state,
                releases: [...(state.releases || []), action.payload],
            };
        },
        setRelease: (state, action: PayloadAction<Release>) => {
            const releases = [...(state.releases || [])];
            const index = releases.findIndex((r) => r.releaseId === action.payload.releaseId);
            if (index >= 0) {
                releases[index] = action.payload;
            }

            return {
                ...state,
                releases: releases,
            };
        },
        setReleaseInfo: (state, action: PayloadAction<ReleaseInfo[] | undefined>) => {
            return {
                ...state,
                releaseInfo: action.payload,
            };
        },
        updateReleaseInfo: (state, action: PayloadAction<ReleaseInfo>) => {
            const releaseInfo = [...(state.releaseInfo || [])];
            const item = releaseInfo.find((i) => i.cultureCode === action.payload.cultureCode);
            if (item) {
                const index = releaseInfo.indexOf(item);
                releaseInfo[index] = { ...action.payload };
            } else {
                releaseInfo.push({ ...action.payload });
            }

            return {
                ...state,
                releaseInfo,
            };
        },
        setReleaseFiles: (state, action: PayloadAction<ReleaseFile[] | undefined>) => {
            return {
                ...state,
                releaseFiles: action.payload,
            };
        },
        setReleaseCountries: (state, action: PayloadAction<string[]>) => {
            return {
                ...state,
                releaseCountries: [...action.payload.sort((a: string, b: string) => a.localeCompare(b))],
            };
        },
        removeRelease: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                releases: [...(state.releases?.filter((r) => r.releaseId !== action.payload) || [])],
            };
        },
    },
});

export const {
    setReleases,
    setSelectedRelease,
    addRelease,
    setRelease,
    setReleaseInfo,
    updateReleaseInfo,
    setReleaseFiles,
    setReleaseCountries,
    removeRelease,
} = releaseSlice.actions;

export default releaseSlice.reducer;
