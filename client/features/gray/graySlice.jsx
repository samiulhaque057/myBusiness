import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const graySlice = createApi({
  reducerPath: "grayApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.SERVER_URL}/api/v1/grays`,
  }),
  tagTypes: ["Grays", "Gray", "GrayPayments"],
  endpoints: (builder) => ({}),
});
