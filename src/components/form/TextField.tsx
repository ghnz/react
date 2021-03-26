import classNames from "classnames";
import React, { FC } from "react";
import { Translation } from "react-i18next";
import { WrappedFieldProps } from "redux-form";

interface TextFieldProps extends WrappedFieldProps {
	label: string,
	name: string,
	type: string,
	placeholder: string;
}
const TextField: FC<TextFieldProps> = ({
	input,
	label,
	name,
	type,
	placeholder,
	meta: { touched, error }
}) => {

	const hasError = touched && error;

	return <Translation>
		{(t) => (
			<div className="fpds-Form-item">
				<label htmlFor={name} className="fpds-Form-itemLabel fpds-FieldLabel">{t(label)}</label>
				<div className={classNames("fpds-Form-itemControl", { "has-error": hasError })}>
					<div className="fpds-TextField">
						<input {...input} placeholder={t(placeholder)} className="fpds-TextField-control" type={type} title={t(error)} />
					</div>
					{hasError && <div className="fpds-Form-itemError">{t(error)}</div>}
				</div>
			</div>
		)}
	</Translation>;
}
export default TextField;