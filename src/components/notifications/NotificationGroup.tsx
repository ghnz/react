import useNotification from "hooks/useNotification";
import React, { FC } from "react"


const NotificationGroup: FC = () => {

	const { notifications, remove } = useNotification();

	return <div className="fpds-NotificationGroup">
		{notifications.map((n, index) =>
			<div className={`fpds-Notification fpds-Notification--toast is-visible ${n.css}`} key={index}>
				<i className="fpds-Notification-icon fpds-Icon fpds-Icon--medium">{n.icon}</i>
				<div className="fpds-Notification-content">
					{n.heading &&
						<h1 className="fpds-Heading fpds-Heading--small">{n.heading}</h1>
					}
					<div className="fpds-Notification-body">{n.message}</div>
				</div>
				<button type="button" className="fpds-Button fpds-Button--subtle fpds-Button--icon" onClick={() => remove(n)}>
					<i className="fpds-Icon">close</i>
				</button>
			</div>
		)}
	</div>
}

export default NotificationGroup;