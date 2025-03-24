import { url } from "inspector";
import { productSlice } from "./productSlice";

const productApi = productSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    deleteProducById: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    updateProductById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    addFinishedDataToProduct: builder.mutation({
      query: (data) => ({
        url: "/add-finished-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    updateMultipleFinishedDataToProduct: builder.mutation({
      query: (data) => ({
        url: "/update-finished-products",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    updateThaanById: builder.mutation({
      query: (data) => ({
        url: `/product-thaan/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    deleteThaanById: builder.mutation({
      query: (id) => ({
        url: `/product-thaan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    createGrayDyeingProduct: builder.mutation({
      query: (data) => ({
        url: `/create-gray-dyeing-products`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    confirmPurchase: builder.mutation({
      query: (data) => ({
        url: "/confirm-purchase",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product", "Products"],
    }),
    updateConfirmPurchase: builder.mutation({
      query: ({ id, data }) => ({
        url: `/confirm-purchase/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product", "Products"],
    }),
    updateFinishedProductDefectById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/update-defect/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product", "Products"],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useDeleteProducByIdMutation,
  useUpdateProductByIdMutation,
  useUpdateThaanByIdMutation,
  useDeleteThaanByIdMutation,
  useCreateGrayDyeingProductMutation,
  useAddFinishedDataToProductMutation,
  useUpdateMultipleFinishedDataToProductMutation,
  useUpdateConfirmPurchaseMutation,
  useConfirmPurchaseMutation,
  useUpdateFinishedProductDefectByIdMutation,
} = productApi;
