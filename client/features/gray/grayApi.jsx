import { graySlice } from "./graySlice";

const grayApi = graySlice.injectEndpoints({
  endpoints: (builder) => ({
    addGray: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Grays"],
    }),
    getAllGrays: builder.query({
      query: (query) => ({
        url: `/${query ? query : ""}`,
        method: "GET",
      }),
      providesTags: ["Grays"],
    }),
    getGrayById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Gray"],
    }),
    deleteGrayById: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Grays"],
    }),
    updateGrayById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Grays", "Gray"],
    }),
    grayPayment: builder.mutation({
      query: (data) => ({
        url: "/gray-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Gray", "Grays", "GrayPayments"],
    }),
    updateGrayPaymentById: builder.mutation({
      query: (data) => ({
        url: `/gray-payment/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Gray", "Grays"],
    }),
    deleteGrayPaymentById: builder.mutation({
      query: (id) => ({
        url: `/gray-payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Gray", "Grays"],
    }),
    toggleChalanMarkedById: builder.mutation({
      query: (data) => ({
        url: `/toggle-marked/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Gray", "Grays"],
    }),
    getAllGraysPayments: builder.query({
      query: (query) => ({
        url: `/all-gray-payments${query ? query : ""}`,
        method: "GET",
      }),
      providesTags: ["GrayPayments"],
    }),
  }),
});

export const {
  useAddGrayMutation,
  useGetAllGraysQuery,
  useGetGrayByIdQuery,
  useDeleteGrayByIdMutation,
  useUpdateGrayByIdMutation,
  useGrayPaymentMutation,
  useUpdateGrayPaymentByIdMutation,
  useDeleteGrayPaymentByIdMutation,
  useGetAllGraysPaymentsQuery,
  useToggleChalanMarkedByIdMutation,
} = grayApi;
