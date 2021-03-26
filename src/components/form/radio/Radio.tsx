import React, { FC } from "react"
import { WrappedFieldProps } from "redux-form";

interface RadioProps extends WrappedFieldProps {
	label: string,
	value: string
}

const Radio: FC<RadioProps> = ({input, label, ...rest}) => {

	return <label className="fpds-Radio">
		<input {...input} {...rest} type="radio" className="fpds-Radio-control" checked={input.value === rest.value} />
		<div className="fpds-Radio-icon"></div>
		<div className="u-fontNormal fpds-Radio-label">{label}</div>
	</label>;
}


export default Radio;