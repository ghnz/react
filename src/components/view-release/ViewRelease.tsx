import { Card, CardSection } from "components/card";
import { DateTime } from "components/fphc-date";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Release from 'types/Release';
import ReleaseFile from "types/ReleaseFile";
import ReleaseInfo from "types/ReleaseInfo";
import FileType from "enums/FileType";
import { bytesToSize } from "utils/functions";
import { ContentSpinner } from "components/spinners";
import { DEFAULT_CULTURE_CODE } from "utils/constants";
import ReleaseState from "enums/ReleaseState";
import { downloadReleaseFile } from "services/releaseFile";
import useNotification from "hooks/useNotification";
import { Region } from "types/Region";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import { fetchCountries } from "redux/reducers/region.slice.reducer";
import * as styles from "./ViewRelease.style";

interface ViewReleaseProps {
	release?: Release,
	info?: ReleaseInfo[],
	files?: ReleaseFile[],
	countries?: string[],
}

const ViewRelease: FC<ViewReleaseProps> = ({ release, info, files, countries }) => {

	const [defaultInfo, setDefaultInfo] = useState<ReleaseInfo | undefined>();
	const [regions, setRegions] = useState<Region[]>();
	const { t } = useTranslation();

	const { success, error } = useNotification();

	useEffect(() => {
		setDefaultInfo(info?.find(i => i.cultureCode === DEFAULT_CULTURE_CODE));
	}, [info])

	const allRegions = useSelector((state: RootState) => state.region.regions);
	const dispatch = useDispatch()
	useEffect(() => {
		if (countries && countries.length) {
			if (!allRegions || !allRegions.length) {
				dispatch(fetchCountries());
			} else {
				setRegions(allRegions
					.map(r => {
						return {
							...r,
							countries: r.countries.filter(c => countries.find(c1 => c1 === c.code))
						};
					}).filter(r => r.countries.length))
			}
		}
	}, [dispatch, allRegions, countries]);

	if (!release || !files) {
		return <ContentSpinner />
	}

	const downloadFile = async (file: ReleaseFile) => {

		try {
			const message = await downloadReleaseFile(release, file);
			success(message);
		} catch {
			error(t("components.view-release.errors.download-file-error", { fileName: file.fileName }));
		}
	}

	return (<styles.ViewRelease className="u-marginTopLarge">
		<Card>
			{defaultInfo?.description &&
				<CardSection>
					<div className="fpds-Grid">
						<div className="fpds-Column--3of12 fpds-Heading u-fontBold">{t("components.view-release.headers.description")}</div>
						<div className="fpds-Column--9of12">{defaultInfo.description}</div>
					</div>
				</CardSection>
			}
			<CardSection>
				<div className="fpds-Grid">
					<div className="fpds-Column--3of12 fpds-Heading u-fontBold">{t("components.view-release.headers.details")}</div>
					<div className="fpds-Column--9of12">
						<div className="fpds-Grid">
							<div className="fpds-Column--8of12">
								<div className="fpds-Detail fpds-Detail--medium u-textMuted u-fontBold u-marginBottomXSmall">{t("components.view-release.headers.version")}</div>
								<div>{release.version}</div>
							</div>
							<div className="fpds-Column--4of12">
								<div className="fpds-Detail fpds-Detail--medium u-textMuted u-fontBold u-marginBottomXSmall">
									{release.status !== ReleaseState.draft && <span>{t("components.view-release.headers.release-date")}</span>}
									{release.status === ReleaseState.draft && <span>{t("components.view-release.headers.last-updated")}</span>}
								</div>
								<div><DateTime date={release.modifiedOn} /></div>
							</div>
						</div>
						{(files && files.length > 0) &&
							<div className="u-marginTopXLarge">
								<div className="fpds-Grid">
									<div className="fpds-Column--8of12">
										<div className="fpds-Detail fpds-Detail--medium u-textMuted u-fontBold">{t("components.view-release.headers.files")}</div>
									</div>
									<div className="fpds-Column--4of12">
										<div className="fpds-Detail fpds-Detail--medium u-textMuted u-fontBold">{t("components.view-release.headers.file-size")}</div>
									</div>
								</div>
								{files.filter(f => f.fileType === FileType.firmware).map((f, i) => <div className="fpds-Grid u-marginTopSmall" key={i}>
									<div className="fpds-Column--8of12">
										<div>{f.fileName}</div>
									</div>
									<div className="fpds-Column--4of12">
										<div>{bytesToSize(f.fileSize)}</div>
									</div>
								</div>)}
								{files.filter(f => f.fileType === FileType.document).map((f, i) =>
									<div className="fpds-Grid u-marginTopXSmall" key={i}>
										<div className="fpds-Column--8of12">
											<div><span className="fpds-Link" onClick={() => downloadFile(f)}>{f.fileName}</span></div>
										</div>
										<div className="fpds-Column--4of12">
											<div>{bytesToSize(f.fileSize)}</div>
										</div>
									</div>)}
							</div>
						}
					</div>
				</div>
			</CardSection>
			{defaultInfo?.whatsNew &&
				<CardSection>
					<div className="fpds-Grid">
						<div className="fpds-Column--3of12 fpds-Heading u-fontBold">{t("components.view-release.headers.whats-new")}</div>
						<div className="fpds-Column--9of12">
							{defaultInfo.whatsNew}
						</div>
					</div>
				</CardSection>
			}
			{(regions && regions.length) &&
				<CardSection>
					<div className="fpds-Grid">
						<div className="fpds-Column--3of12 fpds-Heading u-fontBold">{t("components.view-release.headers.regional-distribution")}</div>
						<div className="fpds-Column--9of12">
							{regions.map((region, i) =>
								<div key={i} className="releaseRegion">
									<label className="u-fontBold">{region.name}:</label>&nbsp;
							{region.countries.map((country, j) => {
										return <span key={j}>{country.name}</span>;
									})}
								</div>
							)}
						</div>
					</div>
				</CardSection>
			}
		</Card >
	</styles.ViewRelease>);
}

export default ViewRelease;