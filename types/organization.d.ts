export type MultimediaFile = {
	id: number;
	fileName: string;
	contentType: string;
	size: number;
	unit: string;
	creationDate: string;
	modificationDate: string;
};

export type Specialization = {
	id: number;
	name: string | null;
	creationDate: string;
	modificationDate: string;
};

export type Provider = {
	id: number;
	name: string;
	email: string;
	phone: string;
	ehrProviderId: string;
	logo: {
		id: number;
		size: number;
		unit: string;
		creationDate: string;
		modificationDate: string;
	} | null;
	specialization: Specialization;
	activeStatus: boolean;
	enableEmailPdf: boolean;
	location: any;
	creationDate: string;
	modificationDate: string;
};

export type Location = {
	id: number;
	name: string;
	address: {
		id: number;
		detail: string;
		city: string;
		state: string;
		zip: string;
		creationDate: string;
		modificationDate: string;
	};
	activeStatus: boolean;
	timeZone: string;
	organization: {
		id: number;
		name: string;
	} | null;
	providers: Array<Provider>;
	creationDate: string;
	modificationDate: string;
};

export type Organization = {
	id: number;
	name: string;
	active: boolean;
	locations: Location[];
	organizationAdmins: Array<{ email: string }>;
	clinicalStaffs: any[];
	multimediaFile: MultimediaFile | null;
	creationDate: string;
	modificationDate: string;
};
