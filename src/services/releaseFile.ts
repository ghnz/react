import { Dispatch } from "@reduxjs/toolkit";
import ReleaseState from "enums/ReleaseState";
import fileDownload from "js-file-download";
import Release from "types/Release";
import { api, urls } from "api";
import ApiError from "api/api-error";
import { setReleaseFiles } from "redux/reducers/release.slice.reducer";
import ReleaseFile from "types/ReleaseFile";

const getReleaseFiles = async (releaseId: string): Promise<ReleaseFile[]> => {
    try {
        const response = await api.get(urls.getReleaseFiles(releaseId));
        return response.data.map((r: any) => {
            return {
                releaseFileId: r.releaseFileId,
                draftBlobStoragePath: r.draftBlobStoragePath,
                cultureCodes: r.cultureCodesList.join(),
                fileName: r.fileName,
                fileType: r.fileType,
                fileSize: r.fileSize,
                isChecksumValid: r.isChecksumValid,
            };
        });
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const fetchReleaseFiles = (releaseId: string) => async (dispatch: Dispatch<any>) => {
    const data = await getReleaseFiles(releaseId);
    await dispatch(setReleaseFiles(data));
};

const addReleaseFile = async (releaseId: string, releaseFile: ReleaseFile, file: File) => {
    try {
        const formData = new FormData();
        formData.append("uploadFile", file);
        if (releaseFile.fileType) {
            formData.append("fileType", releaseFile.fileType);
        }

        if (releaseFile.cultureCodes) {
            releaseFile.cultureCodes
                .split(",")
                .filter((c: any) => c && c.length)
                .forEach((c, index) => {
                    formData.append(`cultureCodesList[${index}]`, c);
                });
        }

        await api.post(urls.createReleaseFile(releaseId), formData, {
            headers: { "content-type": "multipart/form-data" },
        });
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const updateReleaseFile = async (releaseId: string, file: ReleaseFile) => {
    try {
        const data = {
            releaseId,
            releaseFileId: file.releaseFileId,
            fileType: file.fileType,
            cultureCodesList: (file.cultureCodes?.split(",") ?? []).filter((l) => l && l.length),
        };

        await api.put(urls.updateReleaseFile(releaseId, file.releaseFileId ?? ""), data);
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const setChecksumIsValid = async (releaseId: string, releaseFileId: string, isChecksumValid?: boolean) => {
    try {
        const data = {
            isChecksumValid: isChecksumValid,
        };

        await api.patch(urls.updateReleaseFile(releaseId, releaseFileId), data);
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const deleteReleaseFile = async (releaseId: string, releaseFileId: string) => {
    try {
        await api.delete(urls.deleteReleaseFile(releaseId, releaseFileId));
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

const downloadReleaseFile = async (release: Release, releaseFile: ReleaseFile) : Promise<string> => {
	if (release.status === ReleaseState.published) {
		const linkResponse = await api.get(urls.getDownloadReleaseFileLink(release.releaseId, releaseFile.releaseFileId));
		const downloadLink = linkResponse.data;
		const link = document.createElement('a');
		link.href = downloadLink;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		return "File download started.";
	} else {
		const downloadLink = urls.downloadReleaseFile(release.releaseId, releaseFile.releaseFileId);
		const response = await api.get(downloadLink, { responseType: 'arraybuffer'});
		fileDownload(response.data, releaseFile.fileName, response.headers['content-type']);
		return "File download successful.";
	}
}

export { getReleaseFiles, fetchReleaseFiles, addReleaseFile, deleteReleaseFile, setChecksumIsValid, updateReleaseFile, downloadReleaseFile };
