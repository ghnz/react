import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {Region} from "types/Region";

interface RegionSelectorProps {
	region: Region,
	selectedCountries: string[],
	addCountries: (codes: string[]) => void,
	removeCountries: (codes: string[]) => void,
}

const checkboxState = {
	unchecked: "unchecked",
	indeterminate: "indeterminate",
	checked: "checked"
};

const RegionSelector: FC<RegionSelectorProps> = ({ region, addCountries: addCountry, removeCountries: removeCountry, selectedCountries }) => {

	const selectAllRef = useRef<HTMLInputElement>(null);
	const [selectAllState, setSelectAllState] = useState(checkboxState.unchecked);
	const [countryStates, setCountryStates] = useState<{code:string, name: string, selected: boolean}[]>([]);
	const { t } = useTranslation();

	useEffect(() => {
		setCountryStates(
			region.countries.map(c => {
				return {
					code: c.code,
					name: c.name,
					selected: selectedCountries.find(sc => sc === c.code) ? true : false,
				};
			}));

	}, [selectedCountries, region]);

	useEffect(() => {
		const state = !countryStates.find(s => !s.selected)
			? checkboxState.checked
			: (countryStates.find(s => s.selected) ? checkboxState.indeterminate : checkboxState.unchecked);

		setSelectAllState(state);
	}, [countryStates]);

	useEffect(() => {
		if (selectAllRef && selectAllRef.current) {
			selectAllRef.current.indeterminate = selectAllState === checkboxState.indeterminate;
		}

	}, [selectAllState]);

	const changeCountryState = (e: any) => {
		const states = [...countryStates];

		const state = states.find(s => s.code === e.target.id);
		if(!state) return;

		state.selected = e.target.checked;
		updateCountry([state.code], state.selected);
		setCountryStates(states);
	}

	const updateCountry = (codes: string[], selected: boolean) => {

		if (selected) {
			addCountry(codes);
		} else {
			removeCountry(codes);
		}
	}

	const toggeSelectAll = () => {
		const states = [...countryStates];

		states.forEach(s => {
			s.selected = selectAllState !== checkboxState.checked;
		});

		var codes = countryStates.map(s => s.code);
		updateCountry(codes, selectAllState !== checkboxState.checked);

		setCountryStates(states);
	}

	return <div className="u-marginTopLarge">
		<div className="u-fontBold u-textMuted">{region.name}</div>
		<div className="fpds-Stack fpds-Stack--xSmall u-marginTopXSmall">
			<div className="fpds-Flow fpds-Flow--xSmall">
				<label className="fpds-Checkbox countryCheckbox">
					<input type="checkbox"
						className="fpds-Checkbox-control example-indeterminate"
						checked={selectAllState === checkboxState.checked}
						ref={selectAllRef}
						onChange={toggeSelectAll}
					/>
					<div className="fpds-Checkbox-icon"></div>
					<div className="fpds-Checkbox-label">{t("pages.edit-release.regional-distribution.region-selector.select-all")}</div>
				</label>
				{countryStates.map((country, index) => {
					return <label className="fpds-Checkbox u-fontNormal countryCheckbox" key={index}>
						<input type="checkbox"
							name="radio{index}"
							id={country.code}
							className="fpds-Checkbox-control"
							checked={country.selected}
							onChange={changeCountryState} value={country.code} />
						<div className="fpds-Checkbox-icon"></div>
						<div className="fpds-Checkbox-label">{country.name}</div>
					</label>;
				})}
			</div>
		</div>
	</div>;
}

export default RegionSelector;