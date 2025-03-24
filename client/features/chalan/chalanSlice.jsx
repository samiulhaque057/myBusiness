import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chalanSlice = createApi({
  reducerPath: "chalanApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.SERVER_URL}/api/v1/chalans`,
  }),
  tagTypes: ["Chalans"],
  endpoints: (builder) => ({}),
});
