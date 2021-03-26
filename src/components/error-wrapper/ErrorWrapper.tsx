import React, { FC, useEffect } from "react"
import useErrorHandler from "hooks/useErrorHandler";
import { useHistory } from "react-router";
import { ErrorType } from "redux/reducers/error.slice.reducer";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ErrorWrapperProps { }

const ErrorWrapper: FC<ErrorWrapperProps> = ({ children }) => {

	const { error, clearError } = useErrorHandler();
	const history = useHistory();
	const { t } = useTranslation();

	useEffect(() => {
		history.listen(() => {
			clearError();
		})
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (error) {
		if (error === ErrorType.ConnectionRefused) {
			return <ConnectionRefusedError error={error} />
		}

		if (error === ErrorType.Forbidden || error === ErrorType.Unauthorized) {
			return <UnauthorizedError error={error} />
		}

		if (error === ErrorType.NotFound) {
			return <NotFoundError error={error} />
		}

		return <div className="u-overflowAuto">
			<div className="fpds-Container fpds-Container--narrow u-backgroundCanvas">
				<h2 className="fpds-Heading fpds-Heading--large">{t("errors.heading")}</h2>
				<div className="u-marginTopLarge u-fontLighter fpds-Caption">{t("errors.error-code", { errorCode: error })}</div>
				<div className="u-marginTopLarge">
					<p>{t("errors.helpful-links")}</p>
					<p><NavLink className="u-marginTopSmall fpds-Link" to="/">{t("errors.links.home")}</NavLink></p>
				</div>
			</div>
		</div>;
	}

	return <React.Fragment>{children}</React.Fragment>;

}

interface ErrorProps {
	error: ErrorType
}

const NotFoundError: FC<ErrorProps> = ({ error }) => {

	const { t } = useTranslation();

	return <div className="u-overflowAuto">
		<div className="fpds-Container fpds-Container--narrow u-backgroundCanvas">
		<h2 className="fpds-Heading fpds-Heading--large">{t("errors.heading")}</h2>
			<div className="u-marginTopLarge">{t("errors.messages.not-found")}</div>
			<div className="u-marginTopLarge u-fontLighter fpds-Caption">{t("errors.error-code", { errorCode: error })}</div>
			<div className="u-marginTopLarge">
				<p>{t("errors.helpful-links")}</p>
				<p><NavLink className="u-marginTopSmall fpds-Link" to="/">{t("errors.links.home")}</NavLink></p>
			</div>
		</div>
	</div>
}

const UnauthorizedError: FC<ErrorProps> = ({ error }) => {
	
	const { t } = useTranslation();

	return <div className="u-overflowAuto">
		<div className="fpds-Container fpds-Container--narrow u-backgroundCanvas">
			<h2 className="fpds-Heading fpds-Heading--large">{t("errors.heading")}</h2>
			<div className="u-marginTopLarge">{t("errors.messages.not-authorized")}</div>
			<div className="u-marginTopLarge u-fontLighter fpds-Caption">{t("errors.error-code", { errorCode: error })}</div>
			<div className="u-marginTopLarge">
				<p>{t("errors.helpful-links")}</p>
				<p><NavLink className="u-marginTopSmall fpds-Link" to="/">{t("errors.links.home")}</NavLink></p>
			</div>
		</div>
	</div>
}

const ConnectionRefusedError: FC<ErrorProps> = ({ error }) => {

	const { t } = useTranslation();

	return <div className="u-overflowAuto">
		<div className="fpds-Container fpds-Container--narrow u-backgroundCanvas">
		<h2 className="fpds-Heading fpds-Heading--large">{t("errors.heading")}</h2>
			<div className="u-marginTopLarge">{t("errors.messages.cant-connect")}</div>
			<div className="u-marginTopLarge u-fontLighter fpds-Caption">{t("errors.error-code", { errorCode: error })}</div>
			<div className="u-marginTopLarge">
				<p>{t("errors.helpful-links")}</p>
				<p><NavLink className="u-marginTopSmall fpds-Link" to="/">{t("errors.links.home")}</NavLink></p>
			</div>
		</div>
	</div>
}

export { NotFoundError, ConnectionRefusedError, UnauthorizedError };

export default ErrorWrapper;