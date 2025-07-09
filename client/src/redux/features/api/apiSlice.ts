import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api/v1/",
        credentials: 'include'
    }),
    endpoints: (builder) => ({})
})

export const { } = apiSlice