import React, { FC } from "react";
import { WrappedFieldProps } from "redux-form";
import { useTranslation } from "react-i18next";

declare const window: any;

interface RadioGroupProps extends WrappedFieldProps {
	label?: string,
	items: any[],
	itemKey?: string,
	itemLabel?: string
}

const RadioGroup: FC<RadioGroupProps> = (props) => {

	const { input, label, items, itemKey, itemLabel, meta: {touched, error} } = props;

	const { t } = useTranslation();

	return <div className="fpds-Form-item">
		{label && <label className="fpds-Form-itemLabel fpds-FieldLabel">{label}</label>}
		{items.map((item, index) => {
			return <label className="fpds-Radio" key={index}>
				<input type="radio" className="fpds-Radio-control" onChange={input.onChange} checked={input.value === item[itemKey || "id"]} value={item[itemKey || "id"]} />
				<div className="fpds-Radio-icon"></div>
				<div className="u-fontNormal fpds-Radio-label">{item[itemLabel || "label"]}</div>
			</label>;
		})}
		{touched && error && <div className="fpds-Form-itemError">{t(error)}</div>}

	</div>;
}

export default RadioGroup;