import React, { FC, useEffect, useRef } from "react";
import { touch, WrappedFieldProps } from "redux-form";
import { Translation } from "react-i18next";
import { useDispatch } from "react-redux";
import * as styles from "./DropDown.styles";
import classNames from "classnames";

declare const window: any;

interface DropDownProps extends WrappedFieldProps {
	name: string,
	placeholder: string;
}

const DropDown: FC<DropDownProps> = (props) => {

	const { input, placeholder, children, meta: {form, touched, error} } = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const dropDownRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const dispatch = useDispatch();

	useEffect(() => {

		const valueChange = (event: any) => {
			input.onChange(event.currentTarget.value);
			dispatch(touch(form, input.name));
		}

		const onBlur = (event: any) => {
			dispatch(touch(form, input.name));
		}

		let inputElement: HTMLInputElement;
		let triggerElement: HTMLButtonElement;

		if (inputRef && inputRef.current && dropDownRef && dropDownRef.current && triggerRef && triggerRef.current) {
			inputElement = inputRef.current;
			const instance = window.FPDS.Dropdown.init(dropDownRef.current);
			if (instance) {
				instance.value = input.value ?? '';
			}
			inputElement.addEventListener('change', valueChange);
			
			triggerElement = triggerRef.current;
			triggerElement.addEventListener("blur", onBlur);
		}

		return () => {
			if (inputElement) {
				inputElement.removeEventListener('change', valueChange);
			}
			if(triggerElement) {
				triggerElement.removeEventListener("blur", onBlur);
			}
		}

		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputRef, input, dropDownRef, triggerRef, dispatch]);

	return <Translation>
		{(t) => (
			<styles.DropDown className={classNames("fpds-Dropdown", {"has-error": touched && error })} ref={dropDownRef}>
				<button className="fpds-Dropdown-trigger" type="button" ref={triggerRef}>
					<div className="fpds-Dropdown-label">{t(placeholder)}</div>
					<input {...input} className="fpds-Dropdown-control" type="text" ref={inputRef} />
				</button>

				<div className="fpds-Dropdown-popover fpds-Popover">
					<ul className="fpds-Dropdown-menu fpds-Menu">
						{children}
					</ul>
				</div>
			</styles.DropDown>
		)}
	</Translation>;
}

export default DropDown;