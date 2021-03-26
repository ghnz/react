import FileType from "enums/FileType";
import React, { FC, useState } from "react";
import Release from "../../types/Release";
import ReleaseFile from "../../types/ReleaseFile";
import useNotification from "hooks/useNotification";
import { downloadReleaseFile } from "services/releaseFile";
import { useTranslation } from "react-i18next";

interface DownloadReleaseButtonProps {
	release: Release,
	files?: ReleaseFile[],
}

const DownloadReleaseButton: FC<DownloadReleaseButtonProps> = ({ release, files }) => {

	const [downloading, setDownloading] = useState(false);
	const { error, success } = useNotification();

	const { t } = useTranslation();

	const downloadFirmware = async () => {

		const firmware = files?.find(f => f.fileType === FileType.firmware);

		if (release && firmware && firmware.releaseFileId) {
			setDownloading(true);
			try {
				const message = await downloadReleaseFile(release, firmware);
				success(message);
			} catch {
				error(t("components.download-release-button.messages.download-error", { fileName: firmware.fileName }));
			} finally {
				setDownloading(false);
			}
		}
	}

	return <button type="button" className="fpds-Button fpds-Button--primary" onClick={downloadFirmware} disabled={downloading}>
				{!downloading &&
					<i className="fpds-Icon fpds-Icon--small fpds-Button-iconStart">download</i>
				}
				{downloading &&
					<div className="fpds-Button-iconStart">
						<div className="fpds-ProgressSpinner fpds-ProgressSpinner--small"></div>
					</div>
				}
				<span>{t("components.download-release-button.button-text")}</span>
			</button >;
		
}

export default DownloadReleaseButton;

