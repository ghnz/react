import React, { FC, useRef } from "react";
import { useHistory } from "react-router";
import ReleaseState from "enums/ReleaseState";
import Release from "types/Release";
import { Card } from "components/card";
import DeleteModal, { DeleteModalRef } from "./DeleteModal";
import ArchiveModal, { ArchiveModalRef } from "./ArchiveModal";
import { ContentSpinner } from "components/spinners";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

interface ReleaseMenuProps {
	release?: Release;
	releases?: Release[];
	isBulk?: boolean;
	isEdit?: boolean;
	isSubtle?: boolean,
	clearBulkReleases?: () => void;
}

const ReleaseMenu: FC<ReleaseMenuProps> = ({ release, releases, isBulk, isEdit, isSubtle, clearBulkReleases }) => {

	const history = useHistory()
	const deleteModal = useRef<DeleteModalRef>(null);
	const archiveModal = useRef<ArchiveModalRef>(null);
	const { t } = useTranslation();

	const openDeleteReleaseModal = () => {
		if (deleteModal && deleteModal.current) {
			deleteModal.current.open();
		}
	}

	const openArchiveReleaseModal = () => {
		if (archiveModal && archiveModal.current) {
			archiveModal.current.open();
		}
	}

	const editRelease = () => {
		if (release) {
			history.push(`/${release.productId}/draft-releases/${release.releaseId}`);
		}
	}

	if(release?.status === ReleaseState.archived) {
		return <React.Fragment></React.Fragment>;
	}
	if (isBulk) {

		if (!releases || releases.length < 1) {
			return <React.Fragment></React.Fragment>;
		}

		const selectedMessage = releases.length === 1 ? t("pages.release-detail.release-menu.selected-message.singular") : t("pages.release-detail.release-menu.selected-message.plural", {length: releases.length});

		return <React.Fragment>
			<Card>
				<div className="bulkMenu u-flex">
					<div className="u-flexFill">
						{releases[0].status === ReleaseState.draft &&
							<div>
								<button type="button" className="fpds-Button fpds-Button--subtle" onClick={openDeleteReleaseModal}>
									<i className="fpds-Button-iconStart fpds-Icon">trash</i>
									<span>{t("pages.release-detail.release-menu.actions.delete")}</span>
								</button>
							</div>
						}
						{releases[0].status === ReleaseState.published &&
							<div>
								<button type="button" className="fpds-Button fpds-Button--subtle" onClick={openArchiveReleaseModal}>
									<i className="fpds-Button-iconStart fpds-Icon">archive</i>
									<span>{t("pages.release-detail.release-menu.actions.archive")}</span>
								</button>
							</div>
						}
					</div>
					<div className="selectedCount fpds-Flow  u-alignContentCenter"><span>{selectedMessage}</span>
						<button type="button" className="fpds-Button fpds-Button--subtle fpds-Button--icon u-marginLeftXSmall" 
						onClick={() => { if (clearBulkReleases) { clearBulkReleases(); } }}>
							<i className="fpds-Icon">close</i>
						</button>
					</div>
				</div>
			</Card>
			<DeleteModal ref={deleteModal} releases={releases} />
			<ArchiveModal ref={archiveModal} releases={releases} />
		</React.Fragment>
	}

	if (!release) {
		return <ContentSpinner />
	}

	return <React.Fragment>
		<div className="fpds-ActionMenu">
			<button type="button" className={classNames("fpds-ActionMenu-trigger fpds-Button fpds-Button--icon", {"fpds-Button--subtle": isSubtle})}>
				<i className="fpds-Icon">ellipsisH</i>
			</button>
			<div className="fpds-ActionMenu-popover fpds-Popover is-bottomRight">
				<ul className="fpds-ActionMenu-menu fpds-Menu">
					{!isEdit && release.status === ReleaseState.draft && !(releases && releases.length) &&
						<li className="fpds-Menu-item">
							<button type="button" className="fpds-Menu-itemOption" onClick={editRelease}>
								<i className="fpds-Button-iconStart fpds-Icon">edit</i>
								<span>{t("pages.release-detail.release-menu.actions.edit")}</span>
							</button>
						</li>
					}
					{release.status === ReleaseState.draft &&
						<li className="fpds-Menu-item">
							<button type="button" className="fpds-Menu-itemOption" onClick={openDeleteReleaseModal}>
								<i className="fpds-Button-iconStart fpds-Icon">trash</i>
								<span>{t("pages.release-detail.release-menu.actions.delete")}</span>
							</button>
						</li>
					}
					{release.status === ReleaseState.published &&
						< li className="fpds-Menu-item">
							<button type="button" className="fpds-Menu-itemOption" onClick={openArchiveReleaseModal}>
								<i className="fpds-Button-iconStart fpds-Icon">archive</i>
								<span>{t("pages.release-detail.release-menu.actions.archive")}</span>
							</button>
						</li>
					}
				</ul>
			</div>
		</div>
		<DeleteModal ref={deleteModal} release={release} />
		<ArchiveModal ref={archiveModal} release={release} />
	</React.Fragment>;
}

export default ReleaseMenu;
