import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IState = {
    user: any,
    token: String | null
};

const initialState: IState = {
    user: undefined,
    token: null
};

const profileSlice = createSlice({
    name: 'profile',
    initialState: initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            return {
                ...state,
                user: action.payload
            }
        },
        setToken: (state, action: PayloadAction<String>) => {
            return {
                ...state,
                token: action.payload
            }
        }
    }
});

export const { setToken, setUser } = profileSlice.actions;

export default profileSlice.reducer;
