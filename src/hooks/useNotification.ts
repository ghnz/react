import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import { Notification } from "types/Notification";
import { addNotification, removeNotification } from "../redux/reducers/notification.slice.reducer";
import { v4 } from "uuid";

let timeOutHandle: any | undefined;

const useNotification = () => {

	const notifications = useSelector((state: RootState) => state.notification.notifications);

	const dispatch = useDispatch();

	const add = useCallback((notification: Notification) => {
		notification.id = v4();
		dispatch(addNotification(notification));
	}, [dispatch]);

	const info = useCallback((message: string, heading?: string) => {
		add({ message, heading, css: 'fpds-Notification--info', icon: "info" });
	},[add]);

	const success = useCallback((message: string, heading?: string) => {
		add({ message, heading, css: 'fpds-Notification--success', icon: "success" });
	},[add]);

	const error = useCallback((message: string, heading?: string) => {
		add({ message, heading, css: 'fpds-Notification--danger', icon: "error" });
	},[add]);

	const warning = useCallback((message: string, heading?: string) => {
		add({ message, heading, css: 'fpds-Notification--warning', icon: "warning" });
	},[add]);

	const remove = useCallback((notification: Notification) => {
		clearTimeout(timeOutHandle);
		timeOutHandle = undefined;
		dispatch(removeNotification(notification));
	},[dispatch]);

	useEffect(() => {

		if (timeOutHandle) {
			return;
		}

		if (notifications.length) {
			timeOutHandle = setTimeout(() => {
				remove(notifications[0]);
			}, 4000);
		}
	
	//eslint-disable-next-line react-hooks/exhaustive-deps		
	}, [notifications]);

	return { notifications, info, success, error, warning, remove };
}

export default useNotification;