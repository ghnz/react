import React, { FC, useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import TimeAgo from 'react-timeago';


const ReleaseUpdated: FC = () => {

	const [updatedDate, setUpdatedDate] = useState<Date | undefined>();

	const release = useSelector((state: RootState) => state.release.selectedRelease);
	
	useEffect(() => {

		const dates = [];

		if (release) {
			dates.push(new Date(release.modifiedOn));
		}

		if (dates.length) {
			setUpdatedDate(dates.sort((a:any, b:any) => a - b)[0]);
		}
	}, [release])

	if(!updatedDate) return <React.Fragment />;

	return <TimeAgo date={updatedDate as Date} />;
}

export default ReleaseUpdated;