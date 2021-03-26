import React, { FC, useRef } from "react"
import { WrappedFieldProps } from "redux-form";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as styles from "./DatePicker.styles";
import moment from "moment";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

interface DatePickerProps extends WrappedFieldProps {
	label: string,
	disabled: boolean;
}

const DatePicker: FC<DatePickerProps> = (props) => {

	const { label, disabled, input, meta: {touched, error} } = props;
	const { t } = useTranslation();
	const datePickerRef = useRef() as React.MutableRefObject<ReactDatePicker>;

	const openDatepicker = () => {
		datePickerRef?.current?.setFocus();
	}

	return <styles.DatePicker>
		<div className={classNames("fpds-Form-item", {"has-error": touched && error})}>
			<label htmlFor={input.name} className="fpds-Form-itemLabel fpds-FieldLabel">{label}</label>
			<div className="">
				<div className="fpds-TextField has-iconEnd">
					<div className="datePickerWrapper">
						<ReactDatePicker
							ref={datePickerRef}
							disabled={disabled}
							useWeekdaysShort={true}
							selected={input.value ? moment(input.value).toDate() : null}
							onChange={(value: Date | [Date, Date] | null) => {
								input.onChange(moment(value as Date).format())
							}}
							onBlur={input.onBlur}
							className={classNames("fpds-TextField-control", {"has-error": touched && error})}
							dateFormat="dd/MM/yyyy"
							placeholderText="dd/mm/yyyy"
						/>
					</div>
					<button type="button" className="fpds-TextField-iconEnd fpds-Icon fpds-Icon--small" onClick={openDatepicker}>calendar</button>
				</div>
			</div>
			{touched && error && <div className="fpds-Form-itemError">{t(error)}</div>}
		</div>
	</styles.DatePicker>
}

export default DatePicker;