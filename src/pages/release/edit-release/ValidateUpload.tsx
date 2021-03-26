import React, { Dispatch, FC, useEffect, useState } from "react";
import { CardSection } from "components/card/Card.style";
import { ContentSpinner } from "components/spinners";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "redux/reducers";
import ReleaseFile from "types/ReleaseFile";
import { InjectedFormProps, initialize, change, reduxForm, getFormValues, Form } from "redux-form";
import { setErrors } from "redux/reducers/edit-release.slice.reducer";
import { fetchReleaseFiles, setChecksumIsValid } from "services";
import { useTranslation } from "react-i18next";
import useReleaseForm from "hooks/useReleaseForm";
import { downloadReleaseFile } from "services/releaseFile";

interface ValidatUploadProps { }

interface ValidateUploadModel {
	releaseId: string;
	releaseFileId: string;
	isChecksumValid?: boolean;
}

const ValidatUpload: FC<InjectedFormProps<ValidateUploadModel, ValidatUploadProps> & ValidatUploadProps> = (props) => {

	const { form, handleSubmit } = props;
	const { release, updateModifiedOn, setCurrentTab } = useReleaseForm();

	const [downloading, setDownloading] = useState(false);
	const firmware = useSelector((state: RootState) => state.release.releaseFiles?.find(f => f.fileType === "Firmware"));
	const values = useSelector((state: RootState) => getFormValues(form)(state) as ReleaseFile);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	
	useEffect(() => {
		setCurrentTab(form);

		return () => {
			setCurrentTab(undefined);
		}
	}, [form, setCurrentTab]);

	useEffect(() => {

		if (firmware !== null) {
			dispatch(initialize(form, {
				releaseId: release?.releaseId,
				releaseFileId: firmware?.releaseFileId as string,
				isChecksumValid: firmware?.isChecksumValid}));
		}
	}, [firmware, release, form, dispatch])

	const downloadFirmware = async () => {

		if (release && firmware) {
			setDownloading(true);
			try {
				await downloadReleaseFile(release, firmware);
			} finally {
				setDownloading(false);
			}
		}
	}

	const firmwareValidClick = () => {
		dispatch(change(form, "isChecksumValid", true));
	}
	const firmwareInvalidClick = () => {
		dispatch(change(form, "isChecksumValid", false));
	}

	const onSubmit = async (values: ValidateUploadModel, dispatch: Dispatch<any>, props: ValidatUploadProps) => {

		try {
			await setChecksumIsValid(values.releaseId, values.releaseFileId, values.isChecksumValid );
			updateModifiedOn();
			await dispatch(fetchReleaseFiles(values.releaseId));
		} catch (e) {
			dispatch(setErrors(e.errors));
		}
	}
	
	if (!release) {
		return <ContentSpinner />;
	}

	return <CardSection>
		<div className="u-flex">
			<div className="u-flexInitial">
				<div className="fpds-Heading fpds-Heading--bold fpds-Heading--small">{t("pages.edit-release.validate-upload.title")}</div>
			</div>
			<div className="u-flexFill">
				<div className="u-floatRight">
				</div>
			</div>
		</div>
		<div className="u-marginTopLarge">{t("pages.edit-release.validate-upload.description")}</div>
		{firmware &&
			<React.Fragment>
				<div className="u-marginTopLarge fpds-Heading u-fontBold">{t("pages.edit-release.validate-upload.download-file")}</div>
				<div className="u-marginTopMedium">{t("pages.edit-release.validate-upload.download-file-description")}</div>
				<div className="u-marginTopMedium">
					<button type="button" className="fpds-Button" onClick={downloadFirmware} disabled={downloading}>
						{!downloading &&
							<i className="fpds-Icon fpds-Icon--small fpds-Button-iconStart">download</i>
						}
						{downloading &&
							<div className="fpds-Button-iconStart">
								<div className="fpds-ProgressSpinner fpds-ProgressSpinner--small"></div>
							</div>
						}
						<span>{t("pages.edit-release.validate-upload.download")}</span>
					</button>
				</div>
				<hr className="fpds-Divider" />
				<div className="fpds-Heading u-fontBold">{t("pages.edit-release.validate-upload.run-checksum")}</div>
				<div className="u-marginTopMedium">{t("pages.edit-release.validate-upload.run-checksum-description")}</div>
				<Form 
					autoComplete="off" 
					noValidate={true}
					onSubmit={handleSubmit((values: ValidateUploadModel, dispatch: any, props: ValidatUploadProps) => onSubmit(values, dispatch, props))}>
					<div className="u-marginTopMedium fpds-Flow">
						<label className="fpds-ChoiceChip">
							<input className="fpds-ChoiceChip-control" type="radio" name="isChecksumValid" checked={values?.isChecksumValid === true} onChange={firmwareValidClick} />
							<div className="fpds-ChoiceChip-label">{t("pages.edit-release.validate-upload.yes")}</div>
						</label>
						<label className="fpds-ChoiceChip u-marginLeftXSmall">
							<input className="fpds-ChoiceChip-control" type="radio" name="isChecksumValid" checked={values?.isChecksumValid === false} onChange={firmwareInvalidClick} />
							<div className="fpds-ChoiceChip-label">{t("pages.edit-release.validate-upload.no")}</div>
						</label>
					</div>
				</Form>
				{values?.isChecksumValid === true &&
					<div className="u-marginTopLarge fpds-Notification fpds-Notification--success fpds-Notification--banner is-visible">
						<i className="fpds-Notification-icon fpds-Icon fpds-Icon--medium">success</i>
						<div className="fpds-Notification-content">
							<div className="fpds-Notification-header">{t("pages.edit-release.validate-upload.validation-passed")}</div>
							<div className="fpds-Notification-body">{t("pages.edit-release.validate-upload.validation-passed-description")}</div>
						</div>
					</div>
				}
				{values?.isChecksumValid === false &&
					<div className="u-marginTopLarge fpds-Notification fpds-Notification--warning fpds-Notification--banner is-visible">
						<i className="fpds-Notification-icon fpds-Icon fpds-Icon--medium">warning</i>
						<div className="fpds-Notification-content">
							<div className="fpds-Notification-header">{t("pages.edit-release.validate-upload.validation-failed")}</div>
							<div className="fpds-Notification-body">
								<div>{t("pages.edit-release.validate-upload.validation-failed-description")}</div>
								<div className="u-marginTopSmall"><span className="fpds-Link"><NavLink
								className="fpds-Link"
								to={`/${release.productId}/draft-releases/${release.releaseId}/files`}
								exact={true}
							>{t("pages.edit-release.validate-upload.validation-failed-retry")}</NavLink></span></div>
							</div>
						</div>
					</div>
				}
			</React.Fragment>
		}
		{!firmware &&
			<div className="u-marginTopLarge fpds-Notification fpds-Notification--banner is-visible">
				<i className="fpds-Notification-icon fpds-Icon fpds-Icon--medium">info</i>
				<div className="fpds-Notification-content">
					<div className="fpds-Notification-header">{t("pages.edit-release.validate-upload.no-firmware")}</div>
					<div className="fpds-Notification-body">
						<div>{t("pages.edit-release.validate-upload.no-firmware-description")}</div>
						<div className="u-marginTopSmall">
							<NavLink
								className="fpds-Link"
								to={`/${release.productId}/draft-releases/${release.releaseId}/files`}
								exact={true}
							>{t("pages.edit-release.validate-upload.no-firmware-goto-files")}</NavLink>
						</div>
					</div>
				</div>
			</div>
		}
	</CardSection>;
}

export default reduxForm<ValidateUploadModel, ValidatUploadProps>({
	form: 'validateUpload'
})(ValidatUpload);