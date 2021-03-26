import React, { FC, useEffect, useState } from "react";
import { Translation } from "react-i18next";

interface ApiErrorsProps {
	errors?: string[],
	singleHeader: string;
	pluralHeader: string;
}

const ApiErrors: FC<ApiErrorsProps> = ({ errors, singleHeader, pluralHeader }) => {

	const [alertErrors, setAlertErrors] = useState<string[]>([]);

	useEffect(() => {
		setAlertErrors(errors || []);
	}, [errors])

	function clearErrors() {
		setAlertErrors([]);
	}

	return <Translation> 
		{(t) => (<React.Fragment>
		{alertErrors.length > 0 && 
			<div className="fpds-Alert fpds-Alert--danger u-marginTopLarge">
				<i className="fpds-Alert-icon fpds-Icon fpds-Icon--medium">info</i>
				<div className="fpds-Alert-content">
					{alertErrors.length === 1 &&
						<React.Fragment>
							<div className="fpds-Alert-header">{t(singleHeader)}</div>
							<div className="fpds-Alert-body">{t(alertErrors[0])}</div>
						</React.Fragment>
					}
					{alertErrors.length > 1 &&
						<React.Fragment>
							<div className="fpds-Alert-header">{t(pluralHeader)}</div>
							<div className="fpds-Alert-body">
								<ul>
									{alertErrors.map(e => {
										return <li>{t(e)}</li>;
									})
									}
								</ul>
							</div>
						</React.Fragment>
					}
				</div>
				<button
					type="button"
					className="fpds-Alert-close fpds-Button fpds-Button--icon fpds-Button--subtle"
					onClick={clearErrors}
				>
					<i className="fpds-Icon fpds-Icon--small">close</i>
				</button>
			</div>
		}
		</React.Fragment>)}
	</Translation>;
}

export default ApiErrors;