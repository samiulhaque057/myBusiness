import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productSlice = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.SERVER_URL}/api/v1/products`,
  }),
  tagTypes: ["Products", "Product"],
  endpoints: (builder) => ({}),
});
