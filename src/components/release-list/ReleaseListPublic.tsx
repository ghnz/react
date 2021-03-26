import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { Card, CardTable } from 'components/card';
import * as dates from 'components/fphc-date';
import { bytesToSize } from 'utils/functions';
import Release from 'types/Release';
import { ReleaseListEmpty } from "./ReleaseListEmpty";
import { ReleaseListProps } from "./ReleaseList";

interface ReleaseListPublicProps extends ReleaseListProps {
	releases: Release[];
}

const ReleaseListPublic: FC<ReleaseListPublicProps> = ({releases, parentRoute}) => {
	return <Card>
		<CardTable>
			<thead>
				<tr>
					<th>Release name</th>
					<th>Version</th>
					<th>File size</th>
					<th>Release date <i className="fpds-Icon fpds-Icon--small directionArrow">arrowDown</i></th>
				</tr>
			</thead>
			<tbody>
				{releases.length > 0 &&
					releases.map((release, index) => {
						return <tr key={index}>
							<td>
								<NavLink
									className="fpds-Link"
									to={`${parentRoute}/${release.releaseId}`}
									exact
								>{release.name} {release.version}</NavLink>
							</td>
							<td>{release.version}</td>
							<td>{bytesToSize(release.firmwareFileSize)}</td>
							<td><dates.DateTime date={release.modifiedOn} /></td>
						</tr>;
					})}
				<ReleaseListEmpty columns={4} releases={releases}>
					There are no previous releases for this product
			</ReleaseListEmpty>
			</tbody>
		</CardTable>
	</Card>;
};

export default ReleaseListPublic;