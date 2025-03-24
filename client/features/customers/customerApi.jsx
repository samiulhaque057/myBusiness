import { customersSlice } from "./customerSlice";

const customerApi = customersSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCustomer: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    getAllCustomers: builder.query({
      query: (query) => ({
        url: `/${query ? query : ""}`,
        method: "GET",
      }),
      providesTags: ["Customers"],
    }),
    updateCustomerById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers"],
    }),
    deleteCustomeryId: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
    getCustomerById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Customer", "CustomersPayments", "Customers"],
    }),

    getAllcustomersPayments: builder.query({
      query: (query) => ({
        url: `/all-customers-payments${query ? query : ""}`,
        method: "GET",
      }),
      providesTags: ["CustomersPayments"],
    }),
    customerChalanPayment: builder.mutation({
      query: (data) => ({
        url: "/customer-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CustomersPayments"],
    }),
    updateCustomerPayment: builder.mutation({
      query: (data) => ({
        url: `/customer-payment/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CustomersPayments", "Customer", "Customers"],
    }),
    // start
    deleteCustomerPaymentById: builder.mutation({
      query: (id) => ({
        url: `/customer-payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers", "Customer", "CustomersPayments"],
    }),
    getCustomerPaymentById: builder.query({
      query: (id) => ({
        url: `/customer-payment/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Customers", "Customer", "CustomersPayments"],
    }),
    customerPayment: builder.mutation({
      query: (data) => ({
        url: "/customer-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers", "CustomersPayments"],
    }),
    toggleCustomerChalanMarkedById: builder.mutation({
      query: (data) => ({
        url: `/toggle-marked/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers", "CustomersPayments"],
    }),
    getCustomerChalanById: builder.query({
      query: (id) => ({
        url: `/customer-chalan/${id}`,
        method: "GET",
      }),
      providesTags: ["Customer", "Customers"],
    }),
    getAllCustomerChalan: builder.query({
      query: () => ({
        url: `/customer-chalan`,
        method: "GET",
      }),
      providesTags: ["Customer", "Customers"],
    }),
    getAllCustomerCheck: builder.query({
      query: () => ({
        url: `/checks`,
        method: "GET",
      }),
      providesTags: ["Customer", "Customers"],
    }),
    addCustomerCheck: builder.mutation({
      query: (data) => ({
        url: `/checks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers"],
    }),
    updateCustomerCheckById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/checks/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers"],
    }),
    deleteCustomerCheckById: builder.mutation({
      query: (id) => ({
        url: `/checks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer", "Customers"],
    }),
    completeCustomerCheckById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/check-complete/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers"],
    }),
    updatePreviuosDueById: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-previous-due/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers"],
    }),
  }),
});

export const {
  useAddCustomerMutation,
  useDeleteCustomeryIdMutation,
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerByIdMutation,
  useCustomerChalanPaymentMutation,
  useGetAllcustomersPaymentsQuery,
  useUpdateCustomerPaymentMutation,
  useDeleteCustomerPaymentByIdMutation,
  useToggleCustomerChalanMarkedByIdMutation,
  useGetCustomerChalanByIdQuery,
  useGetAllCustomerChalanQuery,
  useGetAllCustomerCheckQuery,
  useAddCustomerCheckMutation,
  useUpdateCustomerCheckByIdMutation,
  useDeleteCustomerCheckByIdMutation,
  useCompleteCustomerCheckByIdMutation,
  useGetCustomerPaymentByIdQuery,
  useUpdatePreviuosDueByIdMutation,
} = customerApi;
