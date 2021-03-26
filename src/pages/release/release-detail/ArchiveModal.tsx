import React, { FC, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { archiveRelease } from "services/release";
import { useHistory, useLocation } from "react-router";
import { setRelease } from "redux/reducers/release.slice.reducer";
import ReleaseState from "enums/ReleaseState";
import Release from "types/Release";
import Modal, { ModalRef } from "components/modal/Modal";
import useNotification from 'hooks/useNotification';
import { Trans, useTranslation } from "react-i18next";

export interface ArchiveModalRef {
	open: () => void
}

interface ArchiveModalProps {
	release?: Release;
	releases?: Release[] | undefined;
}

const ArchiveModal = forwardRef<ArchiveModalRef, ArchiveModalProps>(({ releases, release }, ref) => {

	const history = useHistory()
	const location = useLocation();
	const { success, error } = useNotification();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [isArchiving, setIsArchiving] = useState(false);
	const archiveModal = useRef<ModalRef>(null);

	useImperativeHandle(
		ref,
		() => ({
			open() {
				if (archiveModal && archiveModal.current) {
					archiveModal.current.open();
				}
			},
		}),
	)

	const performArchive = async (r: Release) => {
		if (r) {
			try {
				await archiveRelease(r.releaseId)
				dispatch(setRelease({ ...r, status: ReleaseState.archived }));
				success(t("pages.release-detail.archive-modal.messages.success", release));
			} catch {
				throw new Error(t("pages.release-detail.archive-modal.messages.error", release));
			}
		}
	};

	const onArchiveClick = async () => {
		setIsArchiving(true);
		try {
			if (releases && releases.length) {
				releases.forEach(async r => await performArchive(r));
			} else if (release) {
				await performArchive(release);
			}
			setIsArchiving(false);
			
			if (archiveModal && archiveModal.current) {
				archiveModal.current.close();
			}

			if (release) {
				if (!location.pathname.endsWith("all-releases")) {
					history.push(`/${release.productId}/all-releases/archived/${release.releaseId}`);
				}
			}
		}
		catch (e) {
			error(e);
			setIsArchiving(false);
		}
	}

	const ReleaseText: FC<Release> = (props) => <span className="u-fontBold">{t("pages.release-detail.archive-modal.message-singular-release", props)}</span>

	return <Modal
		header="Archive release?"
		ref={archiveModal}
		actions={(<React.Fragment>
			<button type="button" className="fpds-Modal-actionCancel fpds-Button" disabled={isArchiving}>{t("pages.release-detail.archive-modal.actions.cancel")}</button>
			<button type="button" className="fpds-Modal-actionPrimary fpds-Button fpds-Button--danger" onClick={onArchiveClick} disabled={isArchiving}>
				<span>{t("pages.release-detail.archive-modal.actions.archive")}</span>
				{isArchiving &&
					<div className="fpds-Button-iconEnd">
						<div className="fpds-ProgressSpinner fpds-ProgressSpinner--small fpds-ProgressSpinner--light"></div>
					</div>
				}
			</button>
		</React.Fragment>)}
	>
		<div className="u-flex">
			<div><i className="fpds-Icon fpds-Icon--medium fpds-Display--medium u-textWarning">warningGlyph</i></div>
			<div className="u-marginLeftLarge">{releases && releases.length > 0 &&
				<React.Fragment>
					<p>{t("pages.release-detail.archive-modal.message-plural")}</p>
					<ul className="u-fontBold u-marginTopMedium">
						{releases.map((r, i) => <li key={i}>{r.name} {r.version}</li>)}

					</ul>
				</React.Fragment>
			}
				{release &&
					<p className="u-marginTopMedium"><Trans i18nKey="pages.release-detail.archive-modal.message-singular"  components={[<ReleaseText {...release}/>]} /></p>
				}
			</div>
		</div>
	</Modal>
});

export default ArchiveModal;