import React, { FC } from "react";
import { WrappedFieldProps } from "redux-form";
import { DropDown } from "./";
import { useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

export declare const window: any;


interface ProductDropDownProps extends WrappedFieldProps {
	name: string,
	label: string,
}

const ProductDropDown: FC<ProductDropDownProps> = (props) => {

	const { label, name, meta: { touched, error } } = props;
	const products = useSelector((state: RootState) => state.product.products);

	const { t } = useTranslation();

	return <div className="fpds-Form-item">
		<label htmlFor={name} className="fpds-Form-itemLabel fpds-FieldLabel">{label}</label>
		<div className={classNames("fpds-Form-itemControl", { "has-error": touched && error })}>
			<DropDown
				{...props}
				placeholder="Select product">
				{products?.map((p, index) => <li className="fpds-Menu-item" key={index}>
					<div className="fpds-Menu-itemOption" data-value={p.productId}>
						<span className="fpds-Menu-itemLabel">{p.name}</span>
					</div>
				</li>
				)}
			</DropDown>
			{touched && error && <div className="fpds-Form-itemError">{t(error)}</div>}
		</div>
	</div>;
};

export default ProductDropDown;
