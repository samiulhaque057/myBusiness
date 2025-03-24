import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dailySlice = createApi({
  reducerPath: "dailyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.SERVER_URL}/api/v1/daily-cash`,
  }),
  tagTypes: ["Daily"],
  endpoints: (builder) => ({}),
});
