import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { Region } from "../../../types/Region";
import Release from "../../../types/Release";
import Card from "../../../components/card/Card"
import CardSection from "../../../components/card/CardSection"
import { useTranslation } from "react-i18next";

type Props = {
	regions: Region[];
	release: Release;
}

const RegionalDistributionSection: FC<Props> = ({ regions, release }) => {

	const { t } = useTranslation();

	return <Card>
		<CardSection>
			<div className="fpds-Header-header u-flex">
				<div className="fpds-Header-heading fpds-Heading--small u-flexInitial">{t("pages.review-release.regional-distribution.title")}</div>
				<div className="fpds-Header-heading fpds-Heading--small u-flexFill fpds-Body">
					<div className="u-floatRight"><NavLink
						className="fpds-Button fpds-Button--subtlePrimary"
						exact={true}
						to={`/${release.productId}/draft-releases/${release.releaseId}/regional-distribution`}
					>{t("pages.review-release.regional-distribution.link")}</NavLink></div>
				</div>
			</div>
			{regions.map((region, i) =>
				<div className="u-marginTopLarge" key={i}>
					<div className="fontSlightlyBold">{region.name}</div>
					<div className="fpds-Stack fpds-Stack--small u-marginTopXSmall">
						<div className="fpds-Flow fpds-Flow--xSmall">
							{region.countries.map((country, j) => {
								return <label className="fpds-Checkbox  countryCheckbox" key={j}>
									<i className="fpds-Icon is-iconStart u-textInfo">check</i>
									<div className="fpds-Checkbox-label">{country.name}</div>
								</label>;
							})}
						</div>
					</div>
				</div>
			)}
		</CardSection>
	</Card>;
}

export default RegionalDistributionSection;