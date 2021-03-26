import { api, urls } from "api";
import ApiError from "api/api-error";
import Download from "types/Download";

const getDownloadLog = async (): Promise<Download[]> => {
    try {
        const response = await api.get(urls.getDownloadLog());
        return response.data.map((r: any) => {
            return {
                product: r.productName,
                releaseName: r.releaseName,
                version: r.releaseVersion,
                fileSize: r.fileSize,
                lastDownloaded: r.downloadDate
            };
        }).sort((a:any, b:any) => {
            const dateA = new Date(a.lastDownloaded);
            const dateB = new Date(b.lastDownloaded);
            return +dateB - +dateA;
        });
    } catch (e) {
        throw new ApiError(e.message, e.response);
    }
};

export { getDownloadLog };
