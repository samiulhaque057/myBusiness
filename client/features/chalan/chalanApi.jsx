import { chalanSlice } from "./chalanSlice";

const chalanApi = chalanSlice.injectEndpoints({
  endpoints: (builder) => ({
    addChalan: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chalans"],
    }),
    getAllChalan: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Chalans"],
    }),
  }),
});

export const { useAddChalanMutation, useGetAllChalanQuery } = chalanApi;
