import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const memosSlice = createApi({
  reducerPath: "memoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.SERVER_URL}/api/v1/memos`,
  }),
  tagTypes: ["Memos", "Memo"],
  endpoints: (builder) => ({}),
});
