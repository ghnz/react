import { ApiErrors } from "components/api-errors";
import { TextArea } from "components/form";
import React, { Dispatch, FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, initialize, InjectedFormProps, reduxForm } from "redux-form";
import { RootState } from "redux/reducers";
import { setErrors } from "redux/reducers/edit-release.slice.reducer";
import { saveReleaseInfo } from "services";
import ReleaseInfo from "types/ReleaseInfo";
import { releaseInfoDescriptionRequired } from "../validation";
import { CardSection } from "components/card/Card.style";
import classNames from "classnames";
import { DEFAULT_CULTURE_CODE } from "utils/constants";
import Language from "types/Language";
import useReleaseForm from "hooks/useReleaseForm";
import Modal, { ModalRef } from "components/modal/Modal";

declare const window: any;

interface ReleaseInformationProps { }

const ReleaseInformation: FC<InjectedFormProps<ReleaseInfo, ReleaseInformationProps> & ReleaseInformationProps> = (props) => {

	
	const { pristine, form, handleSubmit } = props;
	const { release, updateModifiedOn, setCurrentTab, performReset, performSubmit } = useReleaseForm();

	const languages = useSelector((state: RootState) => state.language.languages);
	const dispatch = useDispatch();
	const [defaultLanguage, setDefaultLanguage] = useState<Language>();
	const [culture, setCulture] = useState<Language | undefined>(defaultLanguage);
	const releaseInfo = useSelector((state: RootState) => state.release.releaseInfo);
	const errors = useSelector((state: RootState) => state.editRelease.errors);
	const [localized, setLocalized] = useState<Language[]>([]);
	const [notLocalized, setNotLocalized] = useState<Language[]>([]);
	const { t } = useTranslation();
	
	const modalRef = useRef<ModalRef>(null);

	const cultureRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setCurrentTab(form);

		return () => {
			setCurrentTab(undefined);
		}
	}, [form, setCurrentTab]);

	useEffect(() => {
		if (languages && !defaultLanguage) {
			const language = languages.find(l => l.cultureCode === DEFAULT_CULTURE_CODE) || languages[0];
			setDefaultLanguage(language);
		}
	}, [languages, defaultLanguage, setDefaultLanguage,]);


	useEffect(() => {
		if (defaultLanguage && !culture) {
			setCulture(defaultLanguage);
		}

	}, [defaultLanguage, culture, setCulture]);


	useEffect(() => {
		if (languages && releaseInfo) {
			setLocalized(languages.filter(l => releaseInfo.find(i => l.cultureCode === i.cultureCode) ? true : false));
		}
	}, [releaseInfo, languages, setLocalized])


	useEffect(() => {
		if (languages && releaseInfo) {
			setNotLocalized(languages.filter(l => releaseInfo.find(i => l.cultureCode === i.cultureCode) ? false : true))
		}
	}, [releaseInfo, languages, setNotLocalized])


	const [newCultureCode, setNewCultureCode] = useState<string>();

	useEffect(() => {

		const cultureChange = (event: any) => {
			const code = event.currentTarget.value;
			if (code === culture?.cultureCode) return null;

			setNewCultureCode(code);

			if(!pristine) {
				modalRef.current?.open();
			} else {
				const newCulture = languages.find(l => l.cultureCode === code);
				setCulture(newCulture);
			}

			// eslint-disable-next-line no-restricted-globals
			// if (pristine || confirm('Lose changes?')) {
			// 	const newCulture = languages.find(l => l.cultureCode === code);
			// 	setCulture(newCulture);
			// } else {
			// 	if (cultureElement.parentNode?.parentNode) {
			// 		const instance = window.FPDS.Dropdown.getInstance(cultureElement.parentNode?.parentNode);
			// 		instance.value = culture?.cultureCode ?? "";
			// 	}
			// }
		}

		let cultureElement: HTMLInputElement;

		if (cultureRef && cultureRef.current) {
			cultureElement = cultureRef.current;
			cultureElement.addEventListener('change', cultureChange);
		}

		return () => {
			if (cultureElement) {
				cultureElement.removeEventListener('change', cultureChange);
			}
		}

	}, [cultureRef, pristine, culture, languages]);


	const changeToNewCulture = () => {
		const newCulture = languages.find(l => l.cultureCode === newCultureCode);
		setCulture(newCulture);
		modalRef.current?.close();
	}

	const discardChanges = () => {
		performReset();
		changeToNewCulture();
	}

	const saveChanges = () => {
		performSubmit();
		changeToNewCulture();
	}

	useEffect(() => {
		if (culture && releaseInfo && release && form) {
			const info = releaseInfo.find(i => i.cultureCode === culture.cultureCode) || { cultureCode: culture.cultureCode, releaseId: release.releaseId };
			dispatch(initialize(form, info));
		}
	}, [culture, releaseInfo, release, form, dispatch])

	useEffect(() => {
		if (pristine) {
			dispatch(setErrors([]));
		}
	}, [pristine, dispatch]);

	const onSubmit = async (values: ReleaseInfo, dispatch: Dispatch<any>, props: ReleaseInformationProps) => {

		try {
			await dispatch(saveReleaseInfo(values));
			updateModifiedOn();
		} catch (e) {
			dispatch(setErrors(e.errors));
		}
	}

	return <CardSection>
		<Form
			autoComplete="off"
			noValidate={true}
			onSubmit={handleSubmit((values: ReleaseInfo, dispatch: any, props: ReleaseInformationProps) => onSubmit(values, dispatch, props))}>

			<div className="fpds-Header-header u-flex">
				<div className="u-flexInitial">
					<div className="fpds-Heading fpds-Heading--bold fpds-Heading--small">{t('pages.edit-release.release-information.title')}</div>
				</div>
				<div className="u-marginLeftAuto">
					<div className="fpds-Dropdown language-dropdown">
						<button className="fpds-Dropdown-trigger" type="button">
							<div className="fpds-Dropdown-label">{culture?.name}</div>
							<input className="fpds-Dropdown-control" type="text" name="culture" ref={cultureRef} value={culture?.cultureCode || ''} readOnly />
						</button>
						<div className="fpds-Dropdown-popover fpds-Popover">
							<ul className="fpds-Dropdown-menu fpds-Menu">
								{(localized && localized.length > 0) &&
									<React.Fragment>
										<li className="fpds-Menu-header">{t("pages.edit-release.release-information.form.language-selector.localized")}</li>
										{localized.map(l => {
											return <li className="fpds-Menu-item" key={l.cultureCode}>
												<div className={classNames("fpds-Menu-itemOption", { "is-selected": l.cultureCode === culture?.cultureCode })} data-value={l.cultureCode}>
													<span className="fpds-Menu-itemLabel">{l.name}</span>
												</div>
											</li>;
										})}
									</React.Fragment>
								}
								{(notLocalized && notLocalized.length > 0) &&
									<React.Fragment>
										<li className="fpds-Menu-header">{t("pages.edit-release.release-information.form.language-selector.not-localized")}</li>
										{notLocalized.map(l => {
											return <li className="fpds-Menu-item" key={l.cultureCode}>
												<div className={classNames("fpds-Menu-itemOption", { "is-selected": l.cultureCode === culture?.cultureCode })} data-value={l.cultureCode}>
													<i className="fpds-Menu-itemIcon fpds-Icon is-iconStart">plus</i>
													<span className="fpds-Menu-itemLabel">{l.name}</span>
												</div>
											</li>;
										})}
									</React.Fragment>
								}
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="u-marginTopLarge">{t('pages.edit-release.release-information.description')}</div>

			<ApiErrors errors={errors}
				singleHeader={t('pages.edit-release.release-information.form.errors.create-single')}
				pluralHeader={t('pages.edit-release.release-information.form.errors.create-plural')} />

			<div className="u-marginTopLarge">
				<Field
					name="description"
					label="pages.edit-release.release-information.form.description.label"
					placeholder="pages.edit-release.release-information.form.description.placeholder"
					rows={5}
					component={TextArea}
					validate={releaseInfoDescriptionRequired}
				/>
				<Field
					name="whatsNew"
					label="pages.edit-release.release-information.form.whats-new.label"
					placeholder="pages.edit-release.release-information.form.whats-new.placeholder"
					rows={5}
					component={TextArea}
				/>
			</div>
		</Form>
		<Modal
			header={t("pages.edit-release.save-changes-prompt.title")}
			ref={modalRef}
			actions={(<React.Fragment>
				<button type="button" className="fpds-Modal-actionCancel fpds-Button">{t("pages.edit-release.save-changes-prompt.cancel")}</button>
				<button type="button" className="fpds-Modal-actionPrimary fpds-Button fpds-Button--danger" onClick={() => discardChanges()}>
					<span>{t("pages.edit-release.save-changes-prompt.discard")}</span>
				</button>
				<button type="button" className="fpds-Modal-actionPrimary fpds-Button fpds-Button--primary" onClick={() => saveChanges()}>
					<span>{t("pages.edit-release.save-changes-prompt.save")}</span>
					{/* {isWorking &&
						<div className="fpds-Button-iconEnd">
							<div className="fpds-ProgressSpinner fpds-ProgressSpinner--small fpds-ProgressSpinner--light"></div>
						</div>
					} */}
				</button>
			</React.Fragment>)}
		>
			<div className="u-flex">
				<div><i className="fpds-Icon fpds-Icon--medium fpds-Display--medium u-textWarning">warningGlyph</i></div>
				<div className="u-marginLeftLarge">
					<div>{t("Your unsaved release information changes will be lost if you change languages.")}</div>
					<div>{t("You can save you changes, discard your changes, or cancel to continue editing.")}</div>
				</div>
			</div>
		</Modal>		
	</CardSection>;
}

export default reduxForm<ReleaseInfo, ReleaseInformationProps>({
	form: 'releaseInformation'
})(ReleaseInformation);