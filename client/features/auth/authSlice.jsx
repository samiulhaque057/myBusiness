import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.SERVER_URL}/api/v1`,
    credentials: "include",
  }),
  tagTypes: ["Auth", "Users"],
  endpoints: (builder) => ({}),
});
