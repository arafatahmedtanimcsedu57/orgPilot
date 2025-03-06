import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

type Profile = {
  id: string
  name: string
  email: string
  bio?: string
  website?: string
  avatar?: string
}

type UpdateProfileRequest = {
  name: string
  email: string
  bio?: string
  website?: string
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<Profile, UpdateProfileRequest>({
      query: (profile) => ({
        url: "/user/profile",
        method: "PUT",
        body: profile,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
})

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi

