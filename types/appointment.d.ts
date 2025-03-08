import type { Organization } from './organization';

export type Appointment = {
	patientId: string;
	appointmentDate: string | Date;
	name: {
		first: string;
		last: string;
	};
	phoneNumber: string | null;
	providerName: string;
	cliFromStatus: string;
	digiRegFormStatus: string;
	digiRegFormResponseId: string;
	cliFormFormResponseId: string;
	cliAppointmentLink: string;
	digiregAppointmentLink: string;
	organization: Organization;
};
