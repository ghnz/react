import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditReleaseState {
    currentTab?: string;
    errors?: string[]
}

const initialState: EditReleaseState = {};

const editReleaseSlice = createSlice({
    name: 'edit-release',
    initialState: initialState,
    reducers: {
        setEditReleaseState: (state, action: PayloadAction<EditReleaseState | undefined>) => {
            return { ...action.payload };
        },
        setErrors: (state, action: PayloadAction<string[] | undefined>) => {
            return { ...state,
                errors: action.payload };
        },
    },
});

export const { setEditReleaseState, setErrors } = editReleaseSlice.actions;

export default editReleaseSlice.reducer;
