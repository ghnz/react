import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from 'types/Notification';


interface NotificationsState {
	notifications: Notification[];
}

const initialState: NotificationsState = {
	notifications: []
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            }
        },
        removeNotification: (state, action: PayloadAction<Notification>) => {
            return {
                ...state,
                notifications: [...state.notifications.filter(n => n.id !== action.payload.id)]
            }
        },
    }
});

export const { addNotification, removeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
