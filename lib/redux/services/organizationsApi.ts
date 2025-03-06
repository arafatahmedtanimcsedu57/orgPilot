import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

import type {
	Specialization,
	Provider,
	Location,
	Organization,
} from '@/types/organization';

type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

type PaginatedResponse<T> = {
	totalPages: number;
	totalElements: number;
	size: number;
	content: T[];
	number: number;
};

type CreateOrganizationRequest = {
	name: string;
	active: boolean;
	locations?: Array<{ id: number }>;
	multimediaFile?: { id: number };
};

export const organizationsApi = createApi({
	reducerPath: 'organizationsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_PATH}/${process.env.NEXT_PUBLIC_API_VERSION}`,
		prepareHeaders: (headers, { getState }) => {
			const token =
				(getState() as RootState).auth.token ||
				localStorage.getItem('auth-token');
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
			return headers;
		},
	}),
	tagTypes: [
		'Organizations',
		'Organization',
		'Locations',
		'Location',
		'Providers',
		'Provider',
		'Specializations',
		'Specialization',
	],

	endpoints: (builder) => ({
		// Organization
		getOrganizations: builder.query<
			ApiResponse<PaginatedResponse<Organization>>,
			{ page: number; size: number }
		>({
			query: ({ page, size }) => `/organization?page=${page}&size=${size}`,
			providesTags: ['Organizations'],
			keepUnusedDataFor: 300, // Keep unused data in the cache for 5 minutes
		}),

		getOrganizationById: builder.query<ApiResponse<Organization>, number>({
			query: (id) => `/organization/${id}`,
			providesTags: (result, error, id) => [{ type: 'Organization', id }],
		}),

		createOrganization: builder.mutation<
			ApiResponse<Organization>,
			CreateOrganizationRequest
		>({
			query: (organization) => ({
				url: `/organization`,
				method: 'POST',
				body: organization,
			}),
			invalidatesTags: ['Organizations'],
		}),

		updateOrganization: builder.mutation<
			ApiResponse<Organization>,
			{
				id: number;
				name: string;
				active: boolean;
				locations: Array<{
					id: number;
					name: string;
					address?: {
						id: number;
						detail: string;
						city: string;
						state: string;
						zip: string;
					};
					activeStatus: boolean;
					timeZone: string;
					providers?: Array<any>;
				}>;
				organizationAdmins?: Array<{ email: string }>;
				clinicalStaffs?: any[];
				multimediaFile?: { id: number } | null;
			}
		>({
			query: (organization) => ({
				url: `/organization/${organization.id}`,
				method: 'PUT',
				body: organization,
			}),
			invalidatesTags: ['Organizations'],
		}),
		// Organization

		// Location
		getLocations: builder.query<
			ApiResponse<PaginatedResponse<Location>>,
			{ page: number; size: number }
		>({
			query: ({ page, size }) => `/location?page=${page}&size=${size}`,
			providesTags: ['Locations'],
		}),

		getLocationById: builder.query<ApiResponse<Location>, number>({
			query: (id) => `/location/${id}`,
			providesTags: (result, error, id) => [{ type: 'Location', id }],
		}),

		createLocation: builder.mutation<
			ApiResponse<Location>,
			{
				name: string;
				address: {
					detail: string;
					city: string;
					state: string;
					zip: string;
				};
				activeStatus: boolean;
				timeZone: string;
				providers?: Array<{ id: number }>;
				organization?: { id: number };
			}
		>({
			query: (location) => ({
				url: `/location`,
				method: 'POST',
				body: location,
			}),
			invalidatesTags: ['Locations'],
		}),

		updateLocation: builder.mutation<
			ApiResponse<Location>,
			{
				id: number;
				name: string;
				address: {
					id: number;
					detail?: string;
					city: string;
					state: string;
					zip: string;
				};
				activeStatus: boolean;
				timeZone: string;
				providers?: Array<{ id: number }>;
			}
		>({
			query: (location) => ({
				url: `/location/${location.id}`,
				method: 'PUT',
				body: location,
			}),
			invalidatesTags: ['Locations', 'Organizations'],
		}),
		// Location

		// Provider
		getProviderById: builder.query<ApiResponse<Provider>, number>({
			query: (id) => `/provider/${id}`,
			providesTags: (result, error, id) => [{ type: 'Provider', id }],
		}),

		createProvider: builder.mutation<
			ApiResponse<Provider>,
			{
				name: string;
				email: string;
				phone?: string;
				logo: any;
				specialization: { id: number };
				activeStatus: boolean;
				enableEmailPdf: boolean;
				ehrProviderId: string;
			}
		>({
			query: (provider) => ({
				url: `/provider`,
				method: 'POST',
				body: provider,
			}),
			invalidatesTags: ['Providers', 'Locations', 'Organizations'],
		}),

		updateProvider: builder.mutation<
			ApiResponse<Provider>,
			{
				id: number;
				name: string;
				email: string;
				phone: string;
				logo?: { id: number } | null;
				specialization: { id: number };
				activeStatus: boolean;
				enableEmailPdf: boolean;
				ehrProviderId: string;
			}
		>({
			query: (provider) => ({
				url: `/provider/${provider.id}`,
				method: 'PUT',
				body: provider,
			}),
			invalidatesTags: ['Providers', 'Locations', 'Organizations'],
		}),
		// Provider

		// Specialization
		getSpecializations: builder.query<
			ApiResponse<PaginatedResponse<Specialization>>,
			{ page: number; size: number }
		>({
			query: ({ page, size }) => `/specialization?page=${page}&size=${size}`,
			providesTags: ['Specializations'],
		}),

		getSpecializationById: builder.query<ApiResponse<Specialization>, number>({
			query: (id) => `/specialization/${id}`,
			providesTags: (result, error, id) => [{ type: 'Specialization', id }],
		}),

		createSpecialization: builder.mutation<
			ApiResponse<Specialization>,
			{ name: string }
		>({
			query: (specialization) => ({
				url: `/specialization`,
				method: 'POST',
				body: specialization,
			}),
			invalidatesTags: ['Specializations'],
		}),

		updateSpecialization: builder.mutation<
			ApiResponse<Specialization>,
			{
				id: number;
				name: string;
				creationDate?: string;
				modificationDate?: string;
			}
		>({
			query: (specialization) => ({
				url: `/specialization/${specialization.id}`,
				method: 'PUT',
				body: specialization,
			}),
			invalidatesTags: ['Specializations'],
		}),
		// Specialization

		// Multimedia
		uploadMultimedia: builder.mutation<ApiResponse<{ id: number }>, FormData>({
			query: (formData) => ({
				url: `/multimedia/upload`,
				method: 'POST',
				body: formData,
			}),
		}),
		// Multimedia
	}),
});

export const {
	useGetOrganizationsQuery,
	useGetLocationsQuery,
	useGetLocationByIdQuery,
	useGetSpecializationsQuery,
	useGetSpecializationByIdQuery,
	useGetProviderByIdQuery,
	useUploadMultimediaMutation,
	useCreateOrganizationMutation,
	useUpdateOrganizationMutation,
	useCreateProviderMutation,
	useUpdateProviderMutation,
	useUpdateLocationMutation,
	useCreateLocationMutation,
	useGetOrganizationByIdQuery,
	useCreateSpecializationMutation,
	useUpdateSpecializationMutation,
} = organizationsApi;
