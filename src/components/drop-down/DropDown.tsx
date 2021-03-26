import React, { FC, useEffect, useRef } from "react";
import { Translation } from "react-i18next";

declare const window: any;

interface DropDownProps {
	id: string;
	name: string;
	placeholder: string;
	value: string;
	onChange?: (value:string) => void;
}

const DropDown: FC<DropDownProps> = (props) => {

	const { id, name, placeholder, value, onChange, children  } = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const dropDownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {

		let inputElement: HTMLInputElement;

		const valueChange = (event: any) => {
			if(onChange) {
				onChange(inputElement.value);
			}
		}

		if (inputRef && inputRef.current && dropDownRef && dropDownRef.current) {
			inputElement = inputRef.current;
			const instance = window.FPDS.Dropdown.init(dropDownRef.current);
			if(instance) {
				instance.value = value ?? '';
			}
			inputElement.addEventListener('change', valueChange);
		}

		return () => {
			if (inputElement) {
				inputElement.removeEventListener('change', valueChange);
			}
		}

	}, [inputRef, dropDownRef, value, onChange]);

	const onChangeDummy = () => {
		// This is a dummy method because FPDS doesn't trigger react events
	};
	
	return <Translation>
		{(t) => (
			<div className="fpds-Dropdown" ref={dropDownRef}>
				<button className="fpds-Dropdown-trigger" type="button">
					<div className="fpds-Dropdown-label">{t(placeholder)}</div>
					<input id={id} name={name} placeholder={t(placeholder)} value={value} className="fpds-Dropdown-control" type="text" ref={inputRef} onChange={onChangeDummy} />
				</button>

				<div className="fpds-Dropdown-popover fpds-Popover">
					<ul className="fpds-Dropdown-menu fpds-Menu">
						{children}
					</ul>
				</div>
			</div>
		)}
	</Translation>;
}

export default DropDown;