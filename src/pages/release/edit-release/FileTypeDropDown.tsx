import React, { FC } from "react";
import { WrappedFieldProps } from "redux-form";
import DropDown from "components/form/drop-down/DropDown";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

export declare const window: any;


interface FileTypeDropDownProps extends WrappedFieldProps {
	name: string,
	firmwareDisabled: boolean;
}

const FileTypeDropDown: FC<FileTypeDropDownProps> = (props) => {

	const { t } = useTranslation();

	return <DropDown
		{...props}
		placeholder={t("pages.edit-release.files.file-type.placeholder")}>
		<li className="fpds-Menu-item">
			<div className={classNames("fpds-Menu-itemOption", {"is-disabled": props.firmwareDisabled})} data-value="Firmware">
				<span className="fpds-Menu-itemLabel">{t("pages.edit-release.files.file-type.firmware")}</span>
			</div>
		</li>
		<li className="fpds-Menu-item">
			<div className="fpds-Menu-itemOption" data-value="Document">
				<span className="fpds-Menu-itemLabel">{t("pages.edit-release.files.file-type.document")}</span>
			</div>
		</li>
	</DropDown>;
};

export default FileTypeDropDown;
