import React, { FC, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, CardTable } from 'components/card';
import * as dates from 'components/fphc-date';
import Release from 'types/Release';
import ReleaseState from "enums/ReleaseState";
import ReleaseMenu from "pages/release/release-detail/ReleaseMenu";
import { ReleaseListEmpty } from "./ReleaseListEmpty";
import { ReleaseListProps } from "./ReleaseList";
import classNames from "classnames";

interface ReleaseListAdminProps extends ReleaseListProps {
	releases: Release[];
	onSelectedReleasesChanged: (selectedReleases: Release[]) => void;
}

const ReleaseListAdmin: FC<ReleaseListAdminProps> = ({ releases, onSelectedReleasesChanged,  parentRoute }) => {

	const [checkboxes, setCheckboxes] = useState<any>({});
	const [selectAll, setSelectAll] = useState<boolean>(false);
	const [selectedReleases, setSelectedReleases] = useState<Release[]>([]);
	const selectAllRef = useRef<HTMLInputElement>(null);

	const checkboxChange = (releaseId: string, e: React.FormEvent<HTMLInputElement>) => {

		checkboxes[releaseId] = e.currentTarget.checked;

		setCheckboxes({ ...checkboxes });
		if (releases.find(r => checkboxes[r.releaseId] === false)) {
			setSelectAll(false);
		} else {
			setSelectAll(true);
		}
	};

	const onSelectAllChanged = (e: React.FormEvent<HTMLInputElement>) => {

		const checked = (e.currentTarget.checked ? true : false);
		doSetSelectAll(checked);
	};

	const doSetSelectAll = (checked: boolean) => {
		setSelectAll(checked);
		releases.forEach(r => checkboxes[r.releaseId] = checked);
		setCheckboxes({ ...checkboxes });
	};

	useEffect(() => {
		if (releases && releases.length) {
			const cb: any = {};
			releases.forEach(r => cb[r.releaseId] = false);
			setCheckboxes(cb);
		}
	}, [releases, setCheckboxes]);

	useEffect(() => {
		const selected = releases.filter(r => checkboxes[r.releaseId]);
		setSelectedReleases(selected);
		onSelectedReleasesChanged(selected);
	}, [checkboxes, releases, setSelectedReleases, onSelectedReleasesChanged]);

	useEffect(() => {
		if (selectAllRef && selectAllRef.current) {
			selectAllRef.current.indeterminate = selectedReleases && selectedReleases.length > 0 && selectedReleases.length !== releases.length;
		}

	}, [selectedReleases, releases]);

	const showMenu = releases.find(r => r.status !== ReleaseState.archived) ? true : false;

	return <React.Fragment>
		<ReleaseMenu releases={selectedReleases} isBulk={true} clearBulkReleases={() => doSetSelectAll(false)} />
		<div className="u-marginTopSmall">
			<Card>
				<CardTable>
					<thead>
						<tr>
							<th className="fpds-Table-checkboxCell is-actionable">
								<label className="fpds-Checkbox">
									<input type="checkbox" 
										name="radio1" 
										className="fpds-Checkbox-control" 
										checked={selectAll} 
										onChange={onSelectAllChanged} 
										ref={selectAllRef}
										/>
									<div className={classNames("fpds-Checkbox-icon", {})}></div>
								</label>
							</th>
							<th>Release name</th>
							<th>Version</th>
							<th>Created by</th>
							<th>Last updated <i className="fpds-Icon fpds-Icon--small directionArrow">arrowDown</i></th>
							{showMenu && <th></th>}
						</tr>
					</thead>
					<tbody>
						{releases.length > 0 &&
							releases.map((release, index) => {
								return <tr key={index}>
									<th className="fpds-Table-checkboxCell">
										<label className="fpds-Checkbox">
											<input type="checkbox" name="radio1" className="fpds-Checkbox-control" checked={checkboxes[release.releaseId] || false} onChange={(e) => checkboxChange(release.releaseId, e)} />
											<div className="fpds-Checkbox-icon"></div>
										</label>
									</th>
									<td>
										<NavLink
											className="fpds-Link"
											to={`${parentRoute}/${release.releaseId}`}
											exact
										>{release.name} {release.version}</NavLink>
									</td>
									<td>{release.version}</td>
									<td>{release.createdBy}</td>
									<td><dates.DateTime date={release.modifiedOn} /></td>
									{showMenu && <td><ReleaseMenu release={release} isSubtle={true} /></td>}
								</tr>;
							})}
						<ReleaseListEmpty columns={6} releases={releases}>
							<div className="u-fontBold">No releases found</div>
							<div className="u-marginTopLarge">Try changing the filters or search term, or <span className="fpds-Link">prepare a new release</span></div>
						</ReleaseListEmpty>
					</tbody>
				</CardTable>
			</Card>
		</div>
	</React.Fragment>;
};

export default ReleaseListAdmin;
