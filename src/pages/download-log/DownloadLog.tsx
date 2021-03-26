import { Card, CardTable } from "components/card";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as styles from "./DownloadLog.styles";
import Download from "types/Download";
import { getDownloadLog } from "services/downloadLog";
import { bytesToSize } from "utils/functions";
import { DateTime } from "components/fphc-date";
import DropDown from "components/drop-down/DropDown";
import fileDownload from "js-file-download";

const DownloadLog: FC = () => {

	const allProducts = "All products";

	const { t } = useTranslation();
	const [downloading, setDownloading] = useState(false);
	const [searchTerms, setSearchTerms] = useState<string>("");
	const [downloads, setDownloads] = useState<Download[]>([]);
	const [filteredDownloads, setFilteredDownloads] = useState<Download[]>([]);
	const [filterProduct, setFilterProduct] = useState<string>(allProducts);

	const downloadCsv = () => {

		setDownloading(true);
		try {
			let csv = `"${t("pages.download-log.table-headers.product")}","${t("pages.download-log.table-headers.release-name")}","${t("pages.download-log.table-headers.version")}","${t("pages.download-log.table-headers.file-size")}","${t("pages.download-log.table-headers.last-downloaded")}"\r\n`;
			csv += filteredDownloads.map(d => `"${d.product}","${d.releaseName}","${d.version}","${d.fileSize}","${d.lastDownloaded}"\r\n`).join('');
			fileDownload(csv, "downloadlog.csv");
		} finally {
			setDownloading(false);
		}
	};

	const getData = async () => {
		const downloads = await getDownloadLog();
		setDownloads(downloads);
	}

	useEffect(() => {
		getData();
	}, [])

	useEffect(() => {

		setFilteredDownloads(downloads.filter(f =>
			(searchTerms === "" || f.product.toLocaleLowerCase().indexOf(searchTerms.toLocaleLowerCase()) >= 0
				|| f.releaseName.toLocaleLowerCase().indexOf(searchTerms.toLocaleLowerCase()) >= 0
				|| f.version.toLocaleLowerCase().indexOf(searchTerms.toLocaleLowerCase()) >= 0)
			&& (filterProduct === allProducts || f.product === filterProduct)));

	}, [downloads, searchTerms, filterProduct])

	return <React.Fragment>
		<div className="fpds-Header">
			<div className="fpds-Header-header u-flex">
				<div className="u-flexInitial">
					<div className="fpds-Header-heading fpds-Heading--medium">{t("pages.download-log.heading")}</div>
				</div>
				<div className="u-flexFill">
					<div className="u-floatRight">
						<button type="button" className="fpds-Button fpds-Button--primary" onClick={downloadCsv} disabled={downloading}>
							{!downloading &&
								<i className="fpds-Icon fpds-Icon--small fpds-Button-iconStart">download</i>
							}
							{downloading &&
								<div className="fpds-Button-iconStart">
									<div className="fpds-ProgressSpinner fpds-ProgressSpinner--small"></div>
								</div>
							}
							<span>{t("pages.download-log.export")}</span>
						</button >
					</div>
				</div>
			</div>
		</div>
		<div className="u-marginTopLarge u-flex">
			<div className="u-flexInitial">
				<div className="u-flex searchBox">
					<div className="fpds-TextField has-iconStart has-clear">
						<input type="text" className="fpds-TextField-control" placeholder="Search" value={searchTerms} onChange={(e) => setSearchTerms(e.currentTarget.value)} />
						<i className="fpds-TextField-iconStart fpds-Icon fpds-Icon--small">search</i>
						{ (searchTerms && searchTerms.length > 0) && <button className="fpds-TextField-clear" onClick={() => setSearchTerms("")}></button> }
					</div>
					<div className="fpds-ActionMenu u-marginLeftXSmall">
						<button type="button" className="fpds-ActionMenu-trigger  fpds-Button fpds-Button--subtle fpds-Button--icon">
							<i className="fpds-Icon fpds-Icon--small">filter</i>
						</button>
						<div className="fpds-ActionMenu-popover fpds-Popover u-paddingMedium filters">
							<div className="u-fontBold">{t("pages.download-log.filters.heading")}</div>

							<div className="u-marginTopMedium">
								<label className="fpds-FieldLabel">{t("pages.download-log.filters.products")}</label>

								<DropDown
									placeholder="Product"
									name="filterProduct"
									id="filterProduct"
									value={filterProduct}
									onChange={setFilterProduct}>
									<li className="fpds-Menu-item">
										<div className="fpds-Menu-itemOption" data-value={allProducts}>
											<span className="fpds-Menu-itemLabel">{t("pages.download-log.filters.all-products")}</span>
										</div>
									</li>
									{downloads.filter((v, i, a) => a.findIndex(v2 => v2.product === v.product) === i).map((download, index) => <li className="fpds-Menu-item" key={index}>
										<div className="fpds-Menu-itemOption" data-value={download.product}>
											<span className="fpds-Menu-itemLabel">{download.product}</span>
										</div>
									</li>
									)}
								</DropDown>
							</div>
						</div>
					</div>
					{filterProduct !== allProducts &&
						<div className="u-flex selectedFilters">
							<div className="fpds-Tag u-marginLeftXSmall">
								{filterProduct}
								<button type="button" className="fpds-Tag-remove">
									<i className="fpds-Icon" onClick={() => setFilterProduct(allProducts)}>close</i>
								</button>
							</div>
							<div className="u-whitespaceNoWrap u-marginLeftSmall fpds-Link" onClick={() => setFilterProduct(allProducts)}>{t("pages.download-log.filters.clear")}</div>
						</div>
					}
				</div>
			</div>
			<div className="u-flexFill">
				<div className="u-floatRight">

				</div>
			</div>
		</div>
		<div className="u-marginTopLarge">
			<Card>
				<CardTable>
					<thead>
						<tr>
							<th>{t("pages.download-log.table-headers.product")}</th>
							<th>{t("pages.download-log.table-headers.release-name")}</th>
							<th>{t("pages.download-log.table-headers.version")}</th>
							<th>{t("pages.download-log.table-headers.file-size")}</th>
							<th>{t("pages.download-log.table-headers.last-downloaded")} <i className="fpds-Icon fpds-Icon--small directionArrow">arrowDown</i></th>
						</tr>
					</thead>
					<tbody>
						{filteredDownloads.length > 0 && filteredDownloads.map((d, index) => <tr key={index}>
							<td>{d.product}</td>
							<td>{d.releaseName}</td>
							<td>{d.version}</td>
							<td>{bytesToSize(d.fileSize)}</td>
							<td><DateTime date={d.lastDownloaded} /></td>
						</tr>)}
						{filteredDownloads.length === 0 &&
							<tr><td colSpan={5}>
								<styles.EmptylListWrapper>
									<styles.EmptyListContainer>
										<div className="u-fontBold">{t("pages.download-log.empty-list.message-1")}</div>
										<div className="u-marginTopLarge">{t("pages.download-log.empty-list.message-2")}</div>
									</styles.EmptyListContainer>
								</styles.EmptylListWrapper>
							</td></tr>}
					</tbody>
				</CardTable>

			</Card>
		</div>
	</React.Fragment>;
}

export default DownloadLog;