import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Prompt, useHistory } from "react-router-dom";
import Modal, { ModalRef } from "components/modal/Modal";
import { useTranslation } from "react-i18next";

interface SaveChangesPromptProps {
	pristine: boolean;
	save: () => void;
	discard: () => void;
}


const SaveChangesPrompt: FC<SaveChangesPromptProps> = ({ pristine, save, discard }) => {

	const modalRef = useRef<ModalRef>(null);
	const [nextLocation, setNextLocation] = useState<any>();
	const history = useHistory();
	const { t } = useTranslation();
	const [isWorking, setIsWorking] = useState(false);
	const onSaveClick = () => {

		setIsWorking(true);
		save();
	}

	useEffect(() => {
		if (isWorking && pristine) {

			if (modalRef && modalRef.current) {
				modalRef.current.close();
			}

			history.push(nextLocation);

			setNextLocation(undefined);
			setIsWorking(false);
		}
	}, [isWorking, pristine, history, nextLocation])

	const onDiscardClick = () => {
		setIsWorking(true);
		discard();
	}

	const handleRouteChange = (location: any, action: any) => {

		setNextLocation(location);

		if (modalRef && modalRef.current) {
			modalRef.current.open();
			return false;
		}

		return t("pages.edit-release.save-changes-prompt.message");
	}

	const beforeUnload = useCallback((e: any) => {
		e.preventDefault();
		e.returnValue = t("pages.edit-release.save-changes-prompt.message");
		return e.returnValue;
	}, [t]);

	useEffect(() => {
		if (!pristine) {
			window.addEventListener("beforeunload", beforeUnload);
		} else {
			window.removeEventListener("beforeunload", beforeUnload);
		}

		return () => {
			window.removeEventListener("beforeunload", beforeUnload);
		}
	}, [pristine, beforeUnload]);

	return <React.Fragment>
		<Modal
			header={t("pages.edit-release.save-changes-prompt.title")}
			ref={modalRef}
			actions={(<React.Fragment>
				<button type="button" className="fpds-Modal-actionCancel fpds-Button" disabled={isWorking}>{t("pages.edit-release.save-changes-prompt.cancel")}</button>
				<button type="button" className="fpds-Modal-actionPrimary fpds-Button fpds-Button--danger" onClick={onDiscardClick} disabled={isWorking}>
					<span>{t("pages.edit-release.save-changes-prompt.discard")}</span>
				</button>
				<button type="button" className="fpds-Modal-actionPrimary fpds-Button fpds-Button--primary" onClick={onSaveClick} disabled={isWorking}>
					<span>{t("pages.edit-release.save-changes-prompt.save")}</span>
					{isWorking &&
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
					<div>{t("pages.edit-release.save-changes-prompt.warning1")}</div>
					<div>{t("pages.edit-release.save-changes-prompt.warning2")}</div>
				</div>
			</div>
		</Modal>
		<Prompt when={!pristine} message={handleRouteChange} />
	</React.Fragment>;
}

export default SaveChangesPrompt;