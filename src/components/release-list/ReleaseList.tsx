import React, { FC, useEffect, useState } from "react";
import * as styles from './ReleaseList.style';
import Release from 'types/Release';
import ReleaseState from "enums/ReleaseState";
import { useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import DropDown from "components/drop-down/DropDown";
import ReleaseListPublic from "./ReleaseListPublic";
import ReleaseListAdmin from "./ReleaseListAdmin";

declare const window: any;

export interface ReleaseListProps {
	isAdmin?: boolean,
	parentRoute: string,
	releaseState?: ReleaseState,
	excludeCurrent?: boolean,
}

const ReleaseList: FC<ReleaseListProps> = (props) => {

	const { excludeCurrent } = props;
	const [filterCreatedBy, setFilterCreatedBy] = useState<string>("All users");
	const [users, setUsers] = useState<string[]>([]);
	const [searchTerms, setSearchTerms] = useState<string>("");
	const [hideFilters, setHideFilters] = useState(false);

	let releaseState = props.releaseState;

	if (!props.isAdmin) {
		releaseState = ReleaseState.published;
	}

	const releases = useSelector((state: RootState) => state.release.releases);

	const [filteredReleases, setFilteredReleases] = useState<Release[]>([]);

	useEffect(() => {
		if (releases) {
			const filtered = releases.filter(r => r.status === releaseState && (!excludeCurrent || !r.isCurrent))
				.filter(r => !filterCreatedBy || filterCreatedBy === "" || filterCreatedBy === "All users" || r.createdBy === filterCreatedBy)
				.filter(r => !searchTerms || searchTerms === "" || (r.name || "").toLowerCase().indexOf(searchTerms.toLowerCase()) >= 0);

			setFilteredReleases(filtered);
			setUsers(Array.from(new Set(filtered.map(r => r.createdBy))));
		}

	}, [releases, filterCreatedBy, excludeCurrent, releaseState, searchTerms, setFilteredReleases])

	return <styles.ReleaseList>
		{!hideFilters &&
			<div className="u-marginTopLarge u-flex">
				<div className="u-flexInitial">
					<div className="u-flex searchBox">
						<div className="fpds-TextField has-iconStart has-clear">
							<input type="text" className="fpds-TextField-control" placeholder="Search" value={searchTerms} onChange={(e) => setSearchTerms(e.currentTarget.value)} />
							<i className="fpds-TextField-iconStart fpds-Icon fpds-Icon--small">search</i>
							{ (searchTerms && searchTerms.length > 0) && <button className="fpds-TextField-clear" onClick={() => setSearchTerms("")}></button> }
						</div>
						{props.isAdmin &&
							<React.Fragment>
								<div className="fpds-ActionMenu u-marginLeftXSmall">
									<button type="button" className="fpds-ActionMenu-trigger fpds-Button fpds-Button--subtle fpds-Button--icon">
										<i className="fpds-Icon fpds-Icon--small">filter</i>
									</button>
									<div className="fpds-ActionMenu-popover fpds-Popover u-paddingMedium filters">
										<div className="u-fontBold">Filters</div>

										<div className="u-marginTopMedium">
											<label className="fpds-FieldLabel">Created by</label>

											<DropDown
												placeholder="Created by"
												name="filterCreatedBy"
												id="filterCreatedBy"
												value={filterCreatedBy}
												onChange={setFilterCreatedBy}>
												<li className="fpds-Menu-item">
													<div className="fpds-Menu-itemOption" data-value="All users">
														<span className="fpds-Menu-itemLabel">All users</span>
													</div>
												</li>
												{users.map((user, index) => <li className="fpds-Menu-item" key={index}>
													<div className="fpds-Menu-itemOption" data-value={user}>
														<span className="fpds-Menu-itemLabel">{user}</span>
													</div>
												</li>
												)}
											</DropDown>
										</div>
									</div>
								</div>

								{filterCreatedBy !== "All users" &&
									<div className="u-flex selectedFilters">
										<div className="fpds-Tag u-marginLeftXSmall">
											{filterCreatedBy}
											<button type="button" className="fpds-Tag-remove">
												<i className="fpds-Icon" onClick={() => setFilterCreatedBy("All users")}>close</i>
											</button>
										</div>
										<div className="u-whitespaceNoWrap u-marginLeftSmall fpds-Link" onClick={() => setFilterCreatedBy("All users")}>Clear filters</div>
									</div>
								}
							</React.Fragment>
						}
					</div>
				</div>
				<div className="u-flexFill">
					<div className="u-floatRight">

					</div>
				</div>
			</div>
		}
		<div className="u-marginTopMedium">
			{props.isAdmin &&
				<ReleaseListAdmin {...props} releases={filteredReleases} onSelectedReleasesChanged={(selectedReleases: Release[]) => setHideFilters(selectedReleases.length > 0)} />
			}
			{
				!props.isAdmin &&
				<ReleaseListPublic {...props} releases={filteredReleases} />
			}
		</div>
	</styles.ReleaseList>
}

export default ReleaseList;