import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { compareStringCaseInsensitiveAscending } from "utils/functions";
import Language from "types/Language";

const compareLanguage = (a: Language, b: Language) => compareStringCaseInsensitiveAscending(a.name, b.name);

export interface Languages {
    languages: Language[];
}

const initialState: Languages = {
    languages: [],
};

const languageSlice = createSlice({
    name: "language",
    initialState: initialState,
    reducers: {
        setLanguages: (state, action: PayloadAction<Language[]>) => {
            return { ...state, languages: action.payload.sort(compareLanguage) };
        },
    },
});

export const { setLanguages } = languageSlice.actions;

export default languageSlice.reducer;
