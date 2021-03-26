import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "redux/reducers";
import * as styles from "./NewRelease.style";
import NewReleaseModel from "types/NewRelease";
import { addRelease } from "redux/reducers/release.slice.reducer";
import { createRelease } from "services";
import { Translation } from "react-i18next";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { Card, CardSection } from "components/card";
import { ApiErrors } from "components/api-errors";
import { validateNameRequired, validateVersionRequired,validateVersionFormat} from "../validation";
import { TextField } from "components/form";
import useCurrentProduct from "hooks/useCurrentProduct";
import BackTo from "components/back-to/BackTo";

interface NewReleaseProps {}

const NewRelease: FC<InjectedFormProps<NewReleaseModel & NewReleaseProps>> = (props) => {

	const { handleSubmit, pristine, submitting, invalid } = props;
	const productId = useSelector((state: RootState) => state.product.currentProduct?.productId) || "";
	const history = useHistory();
	const dispatch = useDispatch();
	const { afterReleaseAdd } = useCurrentProduct();

	const [errors, setErrors] = useState<string[]>([]);

	function backToDraftReleases() {
		history.push(`/${productId}/draft-releases`);
	}

	const createNewRelease = async (newRelease: NewReleaseModel) => {
		try {
			const release = await createRelease({ ...newRelease, productId });
			dispatch(addRelease(release));
			afterReleaseAdd();
			history.push(`/${productId}/draft-releases/${release.releaseId}`);
		} catch (e) {
			setErrors(e.errors);
		}
	}

	return (
		<Translation>
			{(t) => (
				<styles.NewReleaseStyle className="fpds-Container fpds-Container--narrow u-paddingNone u-backgroundCanvas">
					<BackTo route={`/${productId}/draft-releases`} >{t("pages.new-release.back-to-draft")}</BackTo>
					<div className="fpds-Header">
						<div className="fpds-Header-header u-flex">
							<div className="u-flexInitial">
								<div className="fpds-Header-heading fpds-Heading--medium">{t("pages.new-release.heading")}</div>
							</div>
						</div>
					</div>
					<div className="u-marginTopLarge">
						<form className="fpds-Form" autoComplete="off" onSubmit={handleSubmit(createNewRelease)} noValidate={true}>
							<Card>
								<CardSection>
									<div className="fpds-Heading fpds-Heading--bold fpds-Heading--small">{t('pages.new-release.form.heading')}</div>

									<div className="u-marginTopLarge"> {t('pages.new-release.form.description')}</div>

									<ApiErrors errors={errors}
										singleHeader={t('pages.new-release.form.errors.create-single')}
										pluralHeader={t('pages.new-release.form.errors.create-plural')} />

									<div className="u-marginTopLarge">
										<Field
											name="name"
											type="text"
											label={t('pages.new-release.form.release-name.label')}
											placeholder={t('pages.new-release.form.release-name.placeholder')}
											validate={[validateNameRequired]}
											component={TextField}
										/>
										<Field
											name="version"
											type="text"
											label={t('pages.new-release.form.release-version.label')}
											placeholder={t('pages.new-release.form.release-version.placeholder')}
											validate={[validateVersionRequired, validateVersionFormat]}
											component={TextField}
										/>
									</div>
								</CardSection>
							</Card>

							<hr className="fpds-Divider u-marginTopXLarge" />

							<div className="u-flex">
								<div className="u-flexInitial">
									<button type="button" className="fpds-Button" onClick={backToDraftReleases}>{t('pages.new-release.form.buttons.cancel')}</button>
								</div>
								<div className="u-flexFill">
									<div className="u-floatRight">
										<button className="fpds-Button fpds-Button--primary" type="submit" disabled={pristine || submitting || invalid}>{t('pages.new-release.form.buttons.create')}</button>
									</div>
								</div>
							</div>
						</form >
					</div>
				</styles.NewReleaseStyle>
			)}
		</Translation>
	);
}

export default reduxForm<NewReleaseModel, NewReleaseProps>({
	form: 'newRelease',
})(NewRelease);