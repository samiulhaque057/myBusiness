import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dyeingSlice = createApi({
  reducerPath: "dyeingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.SERVER_URL}/api/v1/dyeings`,
  }),
  tagTypes: ["Dyeings", "Dyeing", "DyeingPayments"],
  endpoints: (builder) => ({}),
});
