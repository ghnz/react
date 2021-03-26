import React, { FC } from "react"
import { useTranslation } from "react-i18next"

const OnBoarding: FC = () => {

	const { t } = useTranslation();

	return <div className="fpds-Grid u-marginTopLarge">
		<div className="fpds-Column fpds-Column--4of12 fpds-Flow u-alignCenter">
			<div>
				<div className="fpds-Heading fpds-Heading--large u-fontBold">{t("pages.all-releases.on-boarding.heading")}</div>
				<div className="u-marginTopMedium u-textSecondary">{t("pages.all-releases.on-boarding.description")}</div>
				<div className="u-marginTopLarge"><button type="button" className="fpds-Button fpds-Button-primary">Button</button></div>
			</div>
		</div>
		<div className="fpds-Column--8of12">
			<div className="u-widthAuto u-borderRadiusLarge u-backgroundWhite u-paddingLarge u-border" style={{ height: "320px" }}></div>
		</div>
	</div>
}

export default OnBoarding