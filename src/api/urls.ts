const urls = {
    getProducts: () => '/products',
    getLatestReleases: () => '/products/latest-release?pageSize=3',
    getReleases: (productId: string) => `/releases?productId=${productId}&pageSize=1000000000`,
    getReleaseInfo: (releaseId: string) =>`/releases/${releaseId}/release-information?pageSize=1000000000`,
    getReleaseFiles: (releaseId: string) =>`/releases/${releaseId}/release-files?pageSize=1000000000`,
    getReleaseCountries: (releaseId: string) =>`/releases/${releaseId}/release-regions`,
    getRegions: () => '/regions',
    downloadReleaseFile: (releaseId: string, releaseFileId: string | undefined) => `/releases/${releaseId}/release-files/${releaseFileId}/download`,
    getDownloadReleaseFileLink: (releaseId: string, releaseFileId: string | undefined) => `/releases/${releaseId}/release-files/${releaseFileId}/downloadlink`,
    createRelease: () => `/releases`,
    updateRelease: (releaseId: string) => `/releases/${releaseId}`,
    publishRelease: (releaseId: string) => `/releases/${releaseId}/status/published`,
    archiveRelease: (releaseId: string) => `/releases/${releaseId}/status/archived`,
    deleteRelease: (releaseId: string) => `/releases/${releaseId}`,
    createReleaseInfo: (releaseId: string) =>`/releases/${releaseId}/release-information`,
    updateReleaseInfo: (releaseId: string, releaseInfoId: string) =>`/releases/${releaseId}/release-information/${releaseInfoId}`,
    createReleaseFile: (releaseId: string) =>`/releases/${releaseId}/release-files`,
    updateReleaseFile: (releaseId: string, fileId: string) =>`/releases/${releaseId}/release-files/${fileId}`,
    deleteReleaseFile: (releaseId: string, fileId: string) =>`/releases/${releaseId}/release-files/${fileId}`,
    updateReleaseCountries: (releaseId: string) =>`/releases/${releaseId}/release-regions`,
    getLanguages: () => `/languages`,
    getDownloadLog: () => `/logs/my-downloads?pageSize=1000000000`,
    getReport: (productId:string, releases: string, countries: string, startDate: string, endDate: string) => 
        `/logs/downloads?productId=${productId}&releases=${releases}&countries=${countries}&startDate=${startDate}&endDate=${endDate}&pageSize=1000000000`,

}

export default urls;