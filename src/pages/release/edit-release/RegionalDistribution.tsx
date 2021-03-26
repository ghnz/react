import { CardSection } from "components/card/Card.style";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { Form, getFormValues, InjectedFormProps, reduxForm } from "redux-form";
import { RootState } from "redux/reducers";
import { setErrors } from "redux/reducers/edit-release.slice.reducer";
import { updateReleaseCountries } from "services";
import RegionSelector from "./RegionSelector";
import { ContentSpinner } from "components/spinners";
import { compareStringAscending } from "utils/functions";
import { useTranslation } from "react-i18next";
import useReleaseForm from "hooks/useReleaseForm";

interface RegionalDistributionProps { }

interface ReleaseCountries {
	releaseId: string;
	countries: string[];
}

const RegionalDistribution: FC<InjectedFormProps<ReleaseCountries, RegionalDistributionProps> & RegionalDistributionProps> = (props) => {

	const { initialize, form, change, handleSubmit } = props;

	const { release, updateModifiedOn, setCurrentTab } = useReleaseForm();

	const regions = useSelector((state: RootState) => state.region.regions);
	const existingCountries = useSelector((state: RootState) => state.release.releaseCountries);
	const values = useSelector((state: RootState) => getFormValues(form)(state) as ReleaseCountries);
	const { t } = useTranslation();

	useEffect(() => {
		initialize({ releaseId: release?.releaseId, countries: existingCountries });
	}, [existingCountries, release, initialize])

	useEffect(() => {
		setCurrentTab(form);

		return () => {
			setCurrentTab(undefined);
		}
	}, [form, setCurrentTab]);

	const addCountries = (codes: string[]) => {

		const selectedCountries = [...values.countries];

		codes.forEach(code => {
			if (selectedCountries.indexOf(code) < 0) {
				selectedCountries.push(code);
			}
		});
		change('countries', selectedCountries.sort(compareStringAscending));
	}

	const removeCountry = (codes: string[]) => {
		const selectedCountries = [...values.countries];

		codes.forEach(code => {
			const index = selectedCountries.indexOf(code);
			if (index >= 0) {
				selectedCountries.splice(index, 1);
			}
		});
		change('countries', selectedCountries.sort((a:string, b: string) => a.localeCompare(b)));
	}

	const onSubmit = async (values: ReleaseCountries, dispatch: any, props: RegionalDistributionProps) => {
		try {
			await dispatch(updateReleaseCountries(values.releaseId, values.countries ));

			updateModifiedOn();
		} catch (e) {
			dispatch(setErrors(e.errors));
		}
	}

	if(!release || !regions || !existingCountries || !values) {
		return <ContentSpinner />;
	}

	return <CardSection>
		<div className="fpds-Header-header u-flex">
			<div className="u-flexInitial">
				<div className="fpds-Heading fpds-Heading--bold fpds-Heading--small">{t("pages.edit-release.regional-distribution.title")}</div>
			</div>
			<div className="u-flexFill">
				<div className="u-floatRight">
				</div>
			</div>
		</div>
		<div className="u-marginTopLarge">{t("pages.edit-release.regional-distribution.description")}</div>
		<Form
			autoComplete="off" 
			noValidate={true} 
			onSubmit={handleSubmit((values: ReleaseCountries, dispatch: any, props: RegionalDistributionProps) => onSubmit(values, dispatch, props))}>
		{regions.map((region, index) => {
			return <div className="u-marginTopLarge" key={index}>
				<RegionSelector
					region={region}
					selectedCountries={values.countries}
					addCountries={addCountries}
					removeCountries={removeCountry} />
			</div>;
		})}
		</Form>		

	</CardSection>;
}

export default reduxForm<ReleaseCountries, RegionalDistributionProps>({
	form: 'releaseDistribution'
})(RegionalDistribution);