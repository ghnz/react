
const validateNameRequired = (name: string): string | undefined => name ? undefined : 'pages.new-release.form.release-name.errors.required';
const validateVersionRequired = (version: string): string | undefined => version ? undefined : 'pages.new-release.form.release-version.errors.required';
const validateVersionFormat = (version: string): string | undefined => version && /^(\d+)(\.\d+)(\.\d+)?(\.\d+)$/.test(version) ? undefined : 'pages.new-release.form.release-version.errors.format';
const releaseInfoDescriptionRequired = (description: string): string | undefined => description ? undefined : 'pages.edit-release.release-information.form.description.errors.required';

export {
	validateNameRequired,
	validateVersionRequired,
	validateVersionFormat,
	releaseInfoDescriptionRequired,
}