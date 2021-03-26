import classNames from "classnames";
import React, { FC } from "react";
import { Translation } from "react-i18next";
import { WrappedFieldProps } from "redux-form";

interface TextAreaProps extends WrappedFieldProps {
	label: string,
	name: string,
	placeholder: string;
	rows: number;
}

const TextArea: FC<TextAreaProps> = ({
	input,
	label,
	name,
	placeholder,
	rows,
	meta: { touched, error }
}) => {

	const hasError = touched && error;

	return <Translation>
		{(t) => (
			<div className="fpds-Form-item">
				<label htmlFor={name} className="fpds-Form-itemLabel fpds-FieldLabel">{t(label)}</label>
				<div className={classNames("fpds-Form-itemControl", { "has-error": hasError })}>
					<div className="fpds-TextArea">
						<textarea {...input} rows={rows} className="fpds-TextArea-control" placeholder={t(placeholder)}></textarea>
					</div>
					{hasError && <div className="fpds-Form-itemError">{t(error)}</div>}
				</div>
			</div>
		)}
	</Translation>;
}
export default TextArea;