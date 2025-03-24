import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customersSlice = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.SERVER_URL}/api/v1/customers`,
  }),
  tagTypes: ["Customers", "Customer", "CustomersPayments"],
  endpoints: (builder) => ({}),
});
