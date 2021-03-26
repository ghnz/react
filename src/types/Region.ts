export interface Country {
	code: string,
	name: string,
}

export interface Region {
	name: string,
	countries: Country[],
}