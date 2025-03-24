import { dailySlice } from "./dailySlice";

const dailyApi = dailySlice.injectEndpoints({
  endpoints: (builder) => ({
    addDailyCash: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Daily"],
    }),
    getAllDailyCash: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Daily"],
    }),
    deleteDailyById: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Daily"],
    }),
    getDailyByDate: builder.query({
      query: (date) => ({
        url: `/${date}`,
        method: "GET",
      }),
      providesTags: ["Daily"],
    }),
    addOthersCost: builder.mutation({
      query: (data) => ({
        url: `/others-cost`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Daily"],
    }),
    addBalance: builder.mutation({
      query: (data) => ({
        url: `/add-balance`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Daily"],
    }),
  }),
});

export const {
  useAddDailyCashMutation,
  useGetAllDailyCashQuery,
  useAddOthersCostMutation,
  useDeleteDailyByIdMutation,
  useGetDailyByDateQuery,
  useAddBalanceMutation,
} = dailyApi;
