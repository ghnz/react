const bytesToSize = (bytes: number) => {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Byte';
	var i = Math.floor(Math.log(bytes) / Math.log(1024));
	return (Math.round((bytes / Math.pow(1024, i) * 100)) /100) + ' ' + sizes[i];
 }

 const compareReleaseDates = (a?: Date, b?: Date): number => {
    const dateA = a || new Date(1900, 1, 1);
    const dateB = b || new Date(1900, 1, 1);
    return +dateB - +dateA;
};

const compareStringAscending = (a:string, b: string) => a.localeCompare(b);

const compareStringCaseInsensitiveAscending = (a:string, b: string) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());

 export {
	 bytesToSize,
	 compareReleaseDates,
	 compareStringAscending,
	 compareStringCaseInsensitiveAscending,
 }