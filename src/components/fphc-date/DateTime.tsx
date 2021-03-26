import React, { FC } from 'react';
import Moment from "react-moment";

type dateTypes = string | number | Array<string | number | object> | object | undefined;

type DateTimeProps = {
	date: dateTypes;
};

export const DateTime: FC<DateTimeProps> = ({ date }) => {
	if(date) {
		return <Moment date={date} format="D MMM yyyy h:mm A" />;
	}

	return <React.Fragment />
}
