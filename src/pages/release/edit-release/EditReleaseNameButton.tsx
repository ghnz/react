import { ModalSize } from "components/modal/ModalSize";
import React, { FC, useRef, useState } from "react"
import Release from "types/Release";
import Modal, { ModalRef } from "components/modal/Modal";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { Translation } from "react-i18next";
import { validateNameRequired, validateVersionRequired, validateVersionFormat } from "../validation";
import { TextField } from "components/form";
import { useDispatch } from "react-redux";
import { updateRelease } from "services";
import { ApiErrors } from "components/api-errors";


interface EditReleaseNameButtonProps {
}


const EditReleaseNameButton: FC<InjectedFormProps<Release> & EditReleaseNameButtonProps> = (props) => {

	const { handleSubmit, pristine, submitting, invalid, reset, initialize } = props;
	const dispatch = useDispatch();
	const [errors, setErrors] = useState<string[]>([]);

	const editNameModal = useRef<ModalRef>(null);

	const opentEditNameModal = () => {
		reset();
		if (editNameModal && editNameModal.current) {
			editNameModal.current.open();
		}
	};

	const saveName = async (release: Release) => {

		try {
			await dispatch(updateRelease({ ...release }));

			initialize(release);

			if (editNameModal && editNameModal.current) {
				editNameModal.current.close();
			}

		} catch (e) {
			setErrors(e.errors);
		}
	}

	return <Translation>
		{(t) => (

			<React.Fragment>
				<button type="button" className="fpds-Button fpds-Button--subtle fpds-Button--icon" onClick={opentEditNameModal}><i className="fpds-Icon fpds-Icon--small">edit</i></button>

				<Modal ref={editNameModal}
					header={t("pages.edit-release-name.title")}
					size={ModalSize.small}
					actions={(<React.Fragment>
						<button type="button" className="fpds-Modal-actionCancel fpds-Button">{t("pages.edit-release-name.form.buttons.cancel")}</button>
						<button type="button" className="fpds-Modal-actionPrimary fpds-Button fpds-Button--primary" disabled={pristine || submitting || invalid} onClick={handleSubmit(saveName)}>
							{t("pages.edit-release-name.form.buttons.save")}
						</button>
					</React.Fragment>)}
				>
					<div className="u-widthFull">

						<ApiErrors errors={errors}
							singleHeader={t('pages.edit-release-name.form.errors.create-single')}
							pluralHeader={t('pages.edit-release-name.form.errors.create-plural')} />

						<form className="fpds-Form">
							<Field
								name="name"
								type="text"
								label={t('pages.edit-release-name.form.release-name.label')}
								placeholder={t('pages.edit-release-name.form.release-name.placeholder')}
								validate={[validateNameRequired]}
								component={TextField}
							/>
							<Field
								name="version"
								type="text"
								label={t('pages.edit-release-name.form.release-version.label')}
								placeholder={t('pages.edit-release-name.form.release-version.placeholder')}
								validate={[validateVersionRequired, validateVersionFormat]}
								component={TextField}
							/>
						</form>
					</div>
				</Modal>
			</React.Fragment>
		)}

	</Translation>;
}

export default reduxForm<Release, EditReleaseNameButtonProps>({
	form: 'editReleaseNameButton',
})(EditReleaseNameButton);