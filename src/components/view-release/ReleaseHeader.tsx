import { DateTime } from "components/fphc-date";
import ReleaseState from "enums/ReleaseState";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import Release from 'types/Release';

interface ReleaseHeaderProps {
	release: Release,
	isAdmin?: boolean
}

const ReleaseHeader: FC<ReleaseHeaderProps> = ({ isAdmin, release, children }) => {

	const { t } = useTranslation();

	return (<div className="fpds-Header">
				<div className="fpds-Header-header u-flex">
					<div className="u-flexInitial">
						<div className="fpds-Header-heading fpds-Heading--medium">{release.name} {release.version}</div>
					</div>
					<div className="u-flexFill">
						<div className="u-floatRight">
							{children}
						</div>
					</div>
				</div>
				{release.status === ReleaseState.published &&
					<div className="fpds-Header-metadata">
						<div className="fpds-Header-metadataItem">
							<div className="fpds-Label fpds-Label--success">{t("components.view-release.release-header.released")}</div>
							<label className="fpds-Header-metadataLabel u-marginLeftXSmall">{t("components.view-release.release-header.released")}&nbsp;{isAdmin && <span>{release.modifiedBy}</span>}&nbsp;<DateTime date={release.modifiedOn} /></label>
						</div>
					</div>
				}
			</div>);
}

export default ReleaseHeader;