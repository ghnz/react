
export default interface ReleaseFile {
	releaseFileId?: string;
	draftBlobStoragePath?: string;
	cultureCodes?: string;
	fileName: string;
	fileType?: string;
	fileSize: number;
	isDeleted?: boolean;
	isChecksumValid?: boolean;
}