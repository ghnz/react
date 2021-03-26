import ReleaseState from "enums/ReleaseState";

export default interface Release {
	releaseId: string;
	productId: string;
	version: string;
	name: string;
	firmwareFileSize: number;
	createdBy: string;
	createdOn: string;
	modifiedBy: string;
	modifiedOn: string;
	description?: string;
	status: ReleaseState;
	isCurrent?: boolean;
}