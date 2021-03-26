import { ApiErrors } from "components/api-errors";
import { Card, CardSection } from "components/card";
import React, { FC, useEffect, useState } from "react";
import { Field, getFormValues, InjectedFormProps, reduxForm } from "redux-form";
import * as styles from "./Reports.styles";
import { ComboBox, DatePicker, ProductDropDown, RadioGroup } from "components/form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import { fetchCountries } from "redux/reducers/region.slice.reducer";
import { Country } from "types/Region";
import Release from "types/Release";
import { api, urls } from "api";
import ApiError from "api/api-error";
import moment from "moment";
import fileDownload from "js-file-download";
import { useTranslation } from "react-i18next";
import ReleaseState from "enums/ReleaseState";

interface ReportProps { }

enum DateRangeType {
	ThisWeek = "This Week",
	LastWeek = "Last Week",
	Custom = "Custom"
}

interface ReportModel {
	productId?: string,
	releases?: string,
	countries?: string,
	dateRangeType: DateRangeType
	downloadedFrom?: Date,
	downloadedTo?: Date,
}

interface ReleaseWithLabel extends Release {
	label: string
}


const validateProductRequired = (productId: string): string | undefined => productId ? undefined : 'pages.reports.validation.product-required';
const validateReleaseVersionRequired = (releases: string): string | undefined => releases ? undefined : 'pages.reports.validation.release-required';
const validateCountryRequired = (releases: string): string | undefined => releases ? undefined : 'pages.reports.validation.country-required';
const dateRangeTypeRequired = (releases: string): string | undefined => releases ? undefined : 'pages.reports.validation.download-date-required';
const endDateRequired = (releases: string): string | undefined => releases ? undefined : 'pages.reports.validation.end-date-required';
const startDateRequired = (releases: string): string | undefined => releases ? undefined : 'pages.reports.validation.start-date-required';


const Reports: FC<InjectedFormProps<ReportModel & ReportProps>> = (props) => {

	const { handleSubmit, pristine, submitting, invalid, form, change } = props;
	const [errors, setErrors] = useState<string[]>([]);
	const [releases, setReleases] = useState<ReleaseWithLabel[]>();
	const regions = useSelector((state: RootState) => state.region.regions);
	const [allCountries, setAllCountries] = useState<Country[]>([]);
	const values = useSelector((state: RootState) => getFormValues(form)(state) as ReportModel);
	const dispatch = useDispatch();
	const [productId, setProductId] = useState<string>();
	const [downloading, setDownloading] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		if (!regions) {
			dispatch(fetchCountries());
		} else {
			const countries = regions.flatMap((r) => r.countries);
			setAllCountries(countries);
		}
	}, [dispatch, regions]);

	useEffect(() => {

		const fetchReleases = async (productId: string) => {
			try {
				const response = await api.get(urls.getReleases(productId));
				const releases = response.data
					.filter((r: Release) => r.status !== ReleaseState.draft)
					.map((r: Release) => { return { ...r, label: `${r.name} ${r.version}` } });
					
				change('releases', undefined);
				setReleases(releases);
			} catch (e) {
				throw new ApiError(e.message, e.response);
			}
		}

		if (productId) {
			fetchReleases(productId);
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productId]);

	const generateReport = async (model: ReportModel) => {

		let startDate = new Date();
		let endDate = new Date();


		if (model.dateRangeType === DateRangeType.Custom) {
			startDate = moment(model.downloadedFrom).toDate();
			endDate = moment(model.downloadedTo).toDate();
		} else {
			if (model.dateRangeType === DateRangeType.LastWeek) {
				endDate = moment(endDate).subtract(7, 'days').toDate();
			}
			startDate = moment(endDate).subtract(7, 'days').toDate();
		}

		setDownloading(true);
		try {
			const response = await api.get(urls.getReport(model.productId || '',
				model.releases === "---select-all---" ? "" : (model.releases || ""),
				model.countries === "---select-all---" ? "" : (model.countries || ""),
				moment(startDate).utc().format(),
				moment(endDate).utc().format()
			));

			let csv = `"${t("pages.reports.csv-headings.country-code")}","${t("pages.reports.csv-headings.download-date")}","${t("pages.reports.csv-headings.user-name")}","${t("pages.reports.csv-headings.email")}","${t("pages.reports.csv-headings.file-name")}","${t("pages.reports.csv-headings.file-size")}","${t("pages.reports.csv-headings.product")}","${t("pages.reports.csv-headings.release")}","${t("pages.reports.csv-headings.version")}"\r\n`;
			csv += response.data.map((d: any) => `"${d.countryCode}",${d.downloadDate},"${d.userName}","${d.emailAddress}","${d.fileName}",${d.fileSize},"${d.productName}","${d.releaseName}","${d.releaseVersion}"\r\n`).join('');

			fileDownload(csv, "report.csv");
		} catch (e) {
			setErrors(e.errors);
		} finally {
			setDownloading(false);
		}
	}

	const productSelected = (newId: any) => {
		if (productId !== newId) {
			setProductId(newId);
		}
	};

	return <styles.ReportsStyle className="fpds-Container fpds-Container--narrow u-paddingNone u-backgroundCanvas">
		<div className="fpds-Header u-paddingTopLarge">
			<div className="fpds-Header-header u-flex">
				<div className="u-flexInitial">
					<div className="fpds-Header-heading fpds-Heading--medium">{t("pages.reports.heading")}</div>
				</div>
			</div>
		</div>
		<div className="u-marginTopLarge">
			<form className="fpds-Form" autoComplete="off" onSubmit={handleSubmit(generateReport)} noValidate={true}>
				<Card>
					<CardSection>
						<div className="fpds-Heading fpds-Heading--small u-fontBold">{t("pages.reports.sub-heading")}</div>

						<div className="u-marginTopLarge">{t("pages.reports.description")}</div>

						<ApiErrors errors={errors}
							singleHeader={t("pages.reports.form.api-errors.singular")}
							pluralHeader={t("pages.reports.form.api-errors.plural")} />

						<div className="u-marginTopLarge">
							<Field
								name="productId"
								label={t("pages.reports.form.product.label")}
								component={ProductDropDown}
								onChange={productSelected}
								validate={[validateProductRequired]}
							/>
							<Field
								name="releases"
								label={t("pages.reports.form.releases.label")}
								component={ComboBox}
								items={releases}
								itemKey="releaseId"
								itemLabel="label"
								isMulti={true}
								disabled={!releases}
								placeholder={t("pages.reports.form.releases.placeholder")}
								selectAllLabel={t("pages.reports.form.releases.select-all")}
								validate={[validateReleaseVersionRequired]}
							/>
							<Field
								name="countries"
								label={t("pages.reports.form.countries.label")}
								component={ComboBox}
								items={allCountries}
								itemKey="code"
								itemLabel="name"
								placeholder={t("pages.reports.form.countries.placeholder")}
								isMulti={true}
								selectAllLabel={t("pages.reports.form.countries.select-all")}
								validate={[validateCountryRequired]}
							/>
							<Field
								component={RadioGroup}
								name="dateRangeType"
								label={t("pages.reports.form.download-date.label")}
								items={[{
									id: DateRangeType.ThisWeek,
									label: t("pages.reports.form.download-date.this-week")
								}, {
									id: DateRangeType.LastWeek,
									label: t("pages.reports.form.download-date.last-week")
								}, {
									id: DateRangeType.Custom,
									label: t("pages.reports.form.download-date.date-range")
								},
								]}
								validate={[dateRangeTypeRequired]}
							/>
							{(values && values.dateRangeType === DateRangeType.Custom) &&
								<div className="fpds-Grid">
									<div className="fpds-Column">
										<Field
											name="downloadedFrom"
											label={t("pages.reports.form.download-date.date-from")}
											component={DatePicker}
											validate={[startDateRequired]}
										/>
									</div>
									<div className="fpds-Column">
										<Field
											name="downloadedTo"
											label={t("pages.reports.form.download-date.date-to")}
											component={DatePicker}
											validate={[endDateRequired]}
										/>
									</div>
								</div>
							}
						</div>
					</CardSection>
				</Card>

				<hr className="fpds-Divider" />

				<div className="u-flex">
					<div className="u-flexFill">
						<div className="u-floatRight">
							<button className="fpds-Button fpds-Button--primary" type="submit" disabled={pristine || submitting || invalid} >
								{!downloading &&
									<i className="fpds-Icon fpds-Icon--small fpds-Button-iconStart">upload</i>
								}
								{downloading &&
									<div className="fpds-Button-iconStart">
										<div className="fpds-ProgressSpinner fpds-ProgressSpinner--small"></div>
									</div>
								}
								<span>{t("pages.reports.form.buttons.export")}</span>
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</styles.ReportsStyle>;
}

export default reduxForm<ReportModel, ReportProps>({
	form: 'reports',
})(Reports);