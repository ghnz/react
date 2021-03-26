import React, { FC, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteRelease } from "services/release";
import { useHistory, useLocation } from "react-router";
import { removeRelease } from "redux/reducers/release.slice.reducer";
import ReleaseState from "enums/ReleaseState";
import Release from "types/Release";
import Modal, { ModalRef } from "components/modal/Modal";
import useNotification from 'hooks/useNotification';
import useCurrentProduct from "hooks/useCurrentProduct";
import { Trans, useTranslation } from "react-i18next";

export interface DeleteModalRef {
	open: () => void
}

interface DeleteModalProps {
	release?: Release;
	releases?: Release[] | undefined;
}

const DeleteModal = forwardRef<DeleteModalRef, DeleteModalProps>(({ releases, release }, ref) => {

	const history = useHistory()
	const location = useLocation();
	const { success, error } = useNotification();
	const dispatch = useDispatch();
	const { afterReleaseDelete } = useCurrentProduct();
	const { t } = useTranslation();
	const [isDeleting, setIsDeleting] = useState(false);
	const deleteModal = useRef<ModalRef>(null);

	useImperativeHandle(
		ref,
		() => ({
			open() {
				if (deleteModal && deleteModal.current) {
					deleteModal.current.open();
				}
			},
		}),
	)
	
	const performDelete = async (release: Release) => {

		try {
			await deleteRelease(release.releaseId);
			dispatch(removeRelease(release.releaseId));
			afterReleaseDelete();
			success(t("pages.release-detail.delete-modal.messages.success", release));
		} catch {
			throw new Error(t("pages.release-detail.delete-modal.messages.error", release));
		}
	}

	const onDeleteClick = async () => {
		setIsDeleting(true);
		try {
			if (releases && releases.length) {
				releases.forEach(async r => await performDelete(r));
			} else if (release) {
				await performDelete(release);
			}

			if (deleteModal && deleteModal.current) {
				deleteModal.current.close();
			}

			if (release) {
				const redirectLocation = release.status === ReleaseState.archived
					? `/${release.productId}/all-releases/archived`
					: `/${release.productId}/draft-releases`;

				if (location.pathname !== redirectLocation) {
					history.push(redirectLocation);
				}
			}			
		} catch (e) {
			error(e);
		} finally {
			setIsDeleting(false);
		}
	}

	const ReleaseText: FC<Release> = (props) => <span className="u-fontBold">{t("pages.release-detail.delete-modal.message-singular-release", props)}</span>

	return <Modal
		header="Delete draft release?"
		ref={deleteModal}
		actions={(<React.Fragment>
			<button type="button" className="fpds-Modal-actionCancel fpds-Button" disabled={isDeleting}>Cancel</button>
			<button type="button" className="fpds-Modal-actionPrimary fpds-Button fpds-Button--danger" onClick={onDeleteClick} disabled={isDeleting}>
				<span>Delete</span>
				{isDeleting &&
					<div className="fpds-Button-iconEnd">
						<div className="fpds-ProgressSpinner fpds-ProgressSpinner--small fpds-ProgressSpinner--light"></div>
					</div>
				}
			</button>
		</React.Fragment>)}
	>
		<div className="u-flex">
			<div><i className="fpds-Icon fpds-Icon--medium fpds-Display--medium u-textWarning">warningGlyph</i></div>
			<div className="u-marginLeftLarge">
				{releases && releases.length &&
					<React.Fragment>
						<p>{t("pages.release-detail.delete-modal.message-plural")}</p>
						<ul className="u-fontBold u-marginTopMedium">
							{releases.map((r, i) => <li key={i}>{r.name} {r.version}</li>)}

						</ul>
					</React.Fragment>
				}
				{release &&
					<p className="u-marginTopMedium"><Trans i18nKey="pages.release-detail.delete-modal.message-singular" components={[<ReleaseText {...release}/>]} /></p>
				}
				<p className="u-marginTopMedium">{t("pages.release-detail.delete-modal.message-no-restore")}</p>
			</div>
		</div>
	</Modal>
});

export default DeleteModal;