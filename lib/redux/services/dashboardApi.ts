import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

type Stats = {
  users: number
  orders: number
  revenue: number
  activeSessions: number
}

type ActivityUser = {
  id: string
  name: string
  avatar: string
}

type Activity = {
  id: string
  description: string
  time: string
  user: ActivityUser
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
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
  endpoints: (builder) => ({
    getStats: builder.query<Stats, void>({
      query: () => "/dashboard/stats",
    }),
    getRecentActivity: builder.query<Activity[], void>({
      query: () => "/dashboard/activity",
    }),
  }),
})

export const { useGetStatsQuery, useGetRecentActivityQuery } = dashboardApi

