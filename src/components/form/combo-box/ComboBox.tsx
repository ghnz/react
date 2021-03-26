import React, { FC, useEffect, useRef, useState } from "react";
import { touch, WrappedFieldProps } from "redux-form";
import classNames from "classnames";
import * as styles from "./ComboBox.styles";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

declare const window: any;

interface ComboBoxProps extends WrappedFieldProps {
	name: string,
	placeholder: string;
	isMulti?: boolean,
	items: any[];
	itemKey: string;
	itemLabel: string;
	selectAllLabel?: string;
	disabled?: boolean;
	isWrapped?: boolean;
	label?: string;
}

const ComboBoxControl:FC<ComboBoxProps> = (props) => {


	const selectAllValue = "---select-all---";

	const { input, placeholder, items, itemKey, itemLabel, isMulti, selectAllLabel, disabled, meta: { touched, error, form } } = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLInputElement>(null);
	const comboBoxRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch()

	const [hasError, setHasError] = useState(false);
	useEffect(() => {
		setHasError(touched && error)
	}, [touched, error ]);

	useEffect(() => {

		const valueChange = (event: any) => {
			input.onChange(event.currentTarget.value);
			dispatch(touch(form, input.name));
		}

		const onBlur = (event: any) => {
			dispatch(touch(form, input.name));
		}

		let inputElement: HTMLInputElement | undefined;
		let labelElement: HTMLInputElement | undefined;

		if (inputRef && inputRef.current && comboBoxRef && comboBoxRef.current && labelRef && labelRef.current) {

			const instance = window.FPDS.ComboBox.getInstance(comboBoxRef.current) ?? window.FPDS.ComboBox.init(comboBoxRef.current);

			if (instance.value !== input.value) {
				instance.value = input.value.split(',').filter((s: any) => s && s.length);
				instance.close();
			}

			if (!inputElement) {
				inputElement = inputRef.current;
				inputElement.addEventListener('change', valueChange);
			}

			if(!labelElement) {
				labelElement = labelRef.current;
				labelElement.addEventListener("blur", onBlur);
			}
		}

		return () => {
			if (inputElement) {
				inputElement.removeEventListener('change', valueChange);
				inputElement = undefined;
			}
			if(labelElement) {
				labelElement.removeEventListener("blur", onBlur);
				labelElement = undefined;
			}
		}

		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputRef, input, comboBoxRef, selectAllLabel, labelRef, dispatch]);


	useEffect(() => {
		if (selectAllLabel
			&& input.value !== selectAllValue
			&& input.value.indexOf(selectAllValue) >= 0
		) {
			setTimeout(() => {
				const instance = window.FPDS.ComboBox.getInstance(comboBoxRef.current);
				if (input.value.indexOf(selectAllValue) > 0) {
					instance.value = [selectAllValue];
				} else {
					instance.value = input.value.split(',').filter((s: string) => s !== selectAllValue);
				}
			}, 1);
		}
	}, [input.value, selectAllLabel])

	if (disabled === true) {
		return <div className="fpds-Form-itemControl is-disabled">
			<div className="fpds-TextField has-iconEnd is-disabled ">
				<input {...input} placeholder={placeholder} className="fpds-TextField-control is-disabled" disabled />
				<button type="button" className="fpds-TextField-iconEnd fpds-Icon">caretDown</button>
			</div>
		</div>
	}

	return <styles.ComboBox className={classNames("fpds-ComboBox", {
		"fpds-ComboBox--multi": isMulti === true,
		"allSelected": (selectAllValue && input.value === selectAllValue),
		"has-error": hasError 
	})} ref={comboBoxRef}>
		<div className="fpds-ComboBox-trigger">
			<input className="fpds-ComboBox-label"  placeholder={placeholder} type="text" ref={labelRef} />
			<input className="fpds-ComboBox-control" type="text" ref={inputRef} />
			<button className="fpds-ComboBox-clear" type="button"></button>
			<button className="fpds-ComboBox-toggle" type="button"></button>
			<input type="hidden" {...input} />
		</div>
		<div className="fpds-ComboBox-popover fpds-Popover">
			<ul className="fpds-ComboBox-menu fpds-Menu">
				{selectAllLabel && <React.Fragment>
					<li className="fpds-Menu-item">
						<div className="fpds-Menu-itemOption" data-value={selectAllValue}>
							{isMulti && <div className="fpds-Menu-itemCheckbox"></div>}
							<div className="fpds-Menu-itemLabel">{selectAllLabel}</div>
						</div>
					</li>
					<hr className="fpds-Menu-divider u-marginTopXSmall" />
				</React.Fragment>}
				{items.map((item, index) => {
					return <li className="fpds-Menu-item" key={index}>
						<div className={classNames("fpds-Menu-itemOption", { "is-disabled": (selectAllValue && input.value === selectAllValue) })} data-value={item[itemKey]}>
							{isMulti && <div className="fpds-Menu-itemCheckbox"></div>}
							<div className="fpds-Menu-itemLabel">{item[itemLabel]}</div>
						</div>
					</li>;
				})}
			</ul>
		</div>
	</styles.ComboBox >;
}

const ComboBox: FC<ComboBoxProps> = (props) => {

	const { input, label, isWrapped, meta: { touched, error } } = props;
	const {t} = useTranslation();

	if (isWrapped === false) {
		return <ComboBoxControl {...props} />;
	}

	return <div className={classNames("fpds-Form-item", {"has-error": touched && error})}>
		{label && label.length &&
			<label htmlFor={input.name} className="fpds-Form-itemLabel fpds-FieldLabel">{t(label)}</label>
		}
		<div className="fpds-Form-itemControl">
			<ComboBoxControl {...props} />
		</div>
		{touched && error && <div className="fpds-Form-itemError">{t(error)}</div>}
	</div>
}

export default ComboBox;