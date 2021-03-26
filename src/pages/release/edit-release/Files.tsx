import { ApiErrors } from "components/api-errors";
import { CardSection, CardTable } from "components/card";
import { ComboBox } from "components/form";
import FileType from "enums/FileType";
import useNotification from "hooks/useNotification";
import useReleaseForm from "hooks/useReleaseForm";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from 'react-dropzone';
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, getFormValues, InjectedFormProps, reduxForm } from "redux-form";
import { RootState } from "redux/reducers";
import { setErrors } from "redux/reducers/edit-release.slice.reducer";
import { addReleaseFile, deleteReleaseFile, fetchReleaseFiles, updateReleaseFile } from "services";
import ReleaseFile from "types/ReleaseFile";
import { bytesToSize } from "utils/functions";
import FileTypeDropDown from "./FileTypeDropDown";

interface Props { }

interface UploadFile extends ReleaseFile {
	uploadedFile?: File;
}

interface ReleaseFiles {
	releaseId: string;
	files: ReleaseFile[];
}

interface FileError {
	fileName: string;
	error: string;
}

let newFiles: File[] = [];

const Files: FC<InjectedFormProps<ReleaseFiles, Props> & Props> = (props) => {

	const { change, initialize, form, handleSubmit } = props;
	const fileExtensionsRegex = /.*\.(pdf|txt|msi|exe)$/i;
	const maxFileNameLength = 50;
	const maxFileSizeMB = 20;
	const megaByte = 1024 * 1024;
	const { release, updateModifiedOn, setCurrentTab } = useReleaseForm();
	const errors = useSelector((state: RootState) => state.editRelease.errors);
	const values = useSelector((state: RootState) => getFormValues(form)(state) as ReleaseFiles);
	const existingFiles: UploadFile[] | undefined = useSelector((state: RootState) => state.release.releaseFiles);
	const dispatch = useDispatch();
	const { error } = useNotification();
	const { t } = useTranslation();

	useEffect(() => {
		newFiles = [];
	}, []);

	useEffect(() => {
		setCurrentTab(form);

		return () => {
			setCurrentTab(undefined);
		}
	}, [form, setCurrentTab]);

	useEffect(() => {

		if (existingFiles && release) {

			let files:(ReleaseFile | undefined)[] = [...values?.files || []]
			initialize({ releaseId: release.releaseId, files: [...existingFiles] });

			let different = false;

			files = files.map(file => {
				// find the existing file in the values array
				const existing = existingFiles.find(f => f.fileName === file?.fileName);
				
				if (!existing){
					if(file?.isDeleted) {
						return undefined;
					}
					different = true;
					return file;
				}

				if(file?.isDeleted) {
					return file;
				} 

				return existing;
			});

			if (different) {
				dispatch(change('files', files.filter(f => f !== undefined)));
			}
		}

		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [release, existingFiles, dispatch])

	const onSubmit = async (values: ReleaseFiles, dispatch: any, props: Props) => {
		try {
	
			const files = values.files.map(f => {
				return {
					...f,
					cultureCodes: f.fileType === FileType.firmware ? undefined : f.cultureCodes
				};
			});
	
			const fileErrors: FileError[] = [];
	
			const addErrors = (e: any, file: ReleaseFile) => {
				if (e.errors) {
					Array.prototype.push.apply(fileErrors, e.errors.filter((e: string) => e !== 'Please try again and if problems persists, contact the support team.').map((e: string) => { return { fileName: file.fileName, error: e }; }))
				}
			}
	
			let tasks = saveNewFiles(files, values, addErrors);
			Array.prototype.push.apply(tasks, deleteFiles(files, values, addErrors));
			Array.prototype.push.apply(tasks, updateFiles(files, values, addErrors));
	
			await Promise.all(tasks);
	
			if (fileErrors.length) {
				dispatch(setErrors(fileErrors.map(e => `${e.fileName}: ${e.error}`)));
			}
			else {
				dispatch(setErrors(undefined));
			}
	
			await dispatch(fetchReleaseFiles(values.releaseId));

			updateModifiedOn();
		} catch (e) {
			dispatch(setErrors(e.errors));
		}
	}
	
	function updateFiles(files: { releaseFileId?: string | undefined; draftBlobStoragePath?: string | undefined; cultureCodes?: string | undefined; fileName: string; fileType?: string | undefined; fileSize: number; isDeleted?: boolean | undefined; }[], values: ReleaseFiles, addErrors: (e: any, file: ReleaseFile) => void): Promise<void>[] {
		return files
			.filter(f => f.isDeleted !== true && f.releaseFileId)
			.map(file => updateReleaseFile(values.releaseId, file)
				.catch(e => addErrors(e, file)));
	}
	
	function deleteFiles(files: { releaseFileId?: string | undefined; draftBlobStoragePath?: string | undefined; cultureCodes?: string | undefined; fileName: string; fileType?: string | undefined; fileSize: number; isDeleted?: boolean | undefined; }[], values: ReleaseFiles, addErrors: (e: any, file: ReleaseFile) => void): Promise<void>[] {
		return files
			.filter(f => f.isDeleted === true && f.releaseFileId)
			.map(file => deleteReleaseFile(values.releaseId, file.releaseFileId ?? '')
				.catch(e => addErrors(e, file)));
	}
	
	function saveNewFiles(files: { releaseFileId?: string | undefined; draftBlobStoragePath?: string | undefined; cultureCodes?: string | undefined; fileName: string; fileType?: string | undefined; fileSize: number; isDeleted?: boolean | undefined; }[], values: ReleaseFiles, addErrors: (e: any, file: ReleaseFile) => void) {
	
	
		return files.filter(f => newFiles.find(nf => !f.releaseFileId && f.fileName === nf.name)).map(releaseFile => {
			const index = newFiles.findIndex(f => f.name === releaseFile.fileName);
	
			return addReleaseFile(values.releaseId, releaseFile, newFiles[index])
				.then(() => {
					newFiles.splice(index, 1);
				}).catch(e => addErrors(e, releaseFile));		
		});
	}
	
	const onDrop = useCallback(async (uploadFiles: File[]) => {
		if (release) {

			const files: ReleaseFile[] = [...values.files];

			uploadFiles.forEach(async (file) => {
				if (files.find(f => f.isDeleted !== true && f.fileName.toLowerCase() === file.name.toLowerCase())) {
					error(t("pages.edit-release.files.errors.file-exists", { fileName: file.name }));
					return;
				}

				if (file.size > (maxFileSizeMB * megaByte)) {
					error(t("pages.edit-release.files.errors.file-too-big", { fileName: file.name, maxFileSizeMB }));
					return;
				}

				if (file.name.length > maxFileNameLength) {
					error(t("pages.edit-release.files.errors.file-name-too-long", { fileName: file.name, maxFileNameLength }));
					return;
				}

				const matches = file.name.match(fileExtensionsRegex);
				if (!matches) {
					error(t("pages.edit-release.files.errors.file-extension-invalid", { fileName: file.name }));
					return;
				}

				newFiles.push(file);

				files.push({
					fileName: file.name,
					fileSize: file.size,
				});

			})

			dispatch(change("files", files));
		}
	}, [release, values, fileExtensionsRegex, change, dispatch, error, megaByte, t]);

	const removeFile = (file: UploadFile) => {
		let index = newFiles.findIndex(f => f.name === file.fileName);
		if (index >= 0) {
			newFiles.splice(index, 1);
			index = values.files.findIndex(f => f.fileName === file.fileName);
			if (index >= 0) {
				const files = [...values.files]
				files.splice(index, 1);
				dispatch(change('files', files));
			}
		} else {
			index = values.files.findIndex(f => f.fileName === file.fileName);
			if (index >= 0) {
				const files = [...values.files]
				files[index] = { ...files[index], isDeleted: true };
				dispatch(change('files', files));
			}
		}
	}

	const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept, open } = useDropzone({
		onDrop,
		noClick: true,
		noKeyboard: true
	});

	const className = useMemo(() => {
		let cn = "u-marginTopLarge fileTarget u-borderMedium";
		if (isDragActive || isDragAccept) cn += " drag-over";
		if (isDragReject) cn += " drag-reject";
		if (values && values.files.filter(f => f.isDeleted !== true).length > 0) cn += " u-hidden";
		return cn;
	}, [isDragActive, isDragReject, isDragAccept, values]);

	const languages = useSelector((state: RootState) => state.language.languages);

	interface SelectAFileLinkProps { open: () => void }

	const SelectAFileLink: FC<SelectAFileLinkProps> = ({ open }) => <span className="fpds-Link" onClick={open}>{t("pages.edit-release.files.select-from-computer-link")}</span>;

	return <React.Fragment>
		<CardSection>
			<div className="fpds-Header-header u-flex">
				<div className="u-flexInitial">
					<div className="fpds-Heading fpds-Heading--bold fpds-Heading--small">{t("pages.edit-release.files.title")}</div>
				</div>
				<div className="u-flexFill">
					<div className="u-floatRight">
						<button type="button" className="fpds-Button fpds-Button--subtlePrimary" onClick={open}>
							<i className="fpds-Icon fpds-Icon--small fpds-Button-iconStart">plus</i>
							<span>{t("pages.edit-release.files.add-files")}</span>
						</button>
					</div>
				</div>
			</div>
			<div className="u-marginTopLarge">{t("pages.edit-release.files.description")}</div>
			<ApiErrors errors={errors}
				singleHeader={t("pages.edit-release.files.errors.singular")}
				pluralHeader={t("pages.edit-release.files.errors.plural")} />
			<div {...getRootProps({ className })}  >
				<input {...getInputProps()} />
				<div>
					<i className="fpds-Icon fpds-Icon--medium">upload</i>
					<div className="fpds-Heading fpds-Heading--small u-marginTopLarge">{t("pages.edit-release.files.drag-n-drop")}</div>
					<div className="u-marginTopLarge"><Trans i18nKey="pages.edit-release.files.select-from-computer" components={[<SelectAFileLink open={open} />]} /></div>
				</div>
			</div>
		</CardSection>
		{(values && values.files.filter(f => f.isDeleted !== true).length > 0) &&
			<Form className="u-marginTopLarge" autoComplete="off" noValidate={true} onSubmit={handleSubmit((values: ReleaseFiles, dispatch: any, props: Props) => onSubmit(values, dispatch, props))}>
				<CardTable>
					<thead>
						<tr>
							<th>{t("pages.edit-release.files.file-list.name")}</th>
							<th>{t("pages.edit-release.files.file-list.size")}</th>
							<th>{t("pages.edit-release.files.file-list.type")}</th>
							<th>{t("pages.edit-release.files.file-list.languages")}</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{values.files.map((file, index) => {
							if (file.isDeleted) return <React.Fragment key={index} />;

							return <tr key={index}>
								<td>{file.fileName}</td>
								<td>{bytesToSize(file.fileSize)}</td>
								<td><Field
									name={`files[${index}].fileType`}
									component={FileTypeDropDown}
									firmwareDisabled={values.files.find(f => f !== file && f.fileType === FileType.firmware && !f.isDeleted) ? true : false}
								/>
								</td>
								<td>
									{file.fileType !== FileType.firmware && <Field
										name={`files[${index}].cultureCodes`}
										component={ComboBox}
										items={languages}
										itemKey="cultureCode"
										itemLabel="name"
										placeholder={t("pages.edit-release.files.file-list.select-languages")}
										isMulti={true}
										isWrapped={false}
									/>}
								</td>
								<td><button className="fpds-Button fpds-Button--subtle fpds-Button--icon" type="button" onClick={() => removeFile(file)}><i className="fpds-Icon fpds-Icon--small">trash</i></button></td>
							</tr>;
						})}
					</tbody>
				</CardTable>
			</Form>
		}
	</React.Fragment>;
}

export default reduxForm<ReleaseFiles, Props>({
	form: 'releaseFiles'
})(Files);
