import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ErrorType {
    ConnectionRefused = "net::ERR_CONNECTION_REFUSED",
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404
}

interface ErrorState {
	error: ErrorType | undefined ;
}

const initialState: ErrorState = {
	error: undefined
};

const errorSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        setError: (state, action: PayloadAction<ErrorType | undefined>) => {
            return {
                ...state,
                error: action.payload
            }
        },
    }
});

export const { setError } = errorSlice.actions;

export default errorSlice.reducer;
