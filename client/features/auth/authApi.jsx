import { authSlice } from "./authSlice";

const authApi = authSlice.injectEndpoints({
  endpoints: (builder) => ({
    authLogin: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    authLogout: builder.mutation({
      query: (data) => ({
        url: "/auth/logout",
        method: "POST",
        data: data,
      }),
    }),
    loggedInUser: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    updateUserById: builder.mutation({
      query: (data) => ({
        url: `/users/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users", "Auth"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUserById: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useAuthLoginMutation,
  useAuthLogoutMutation,
  useLoggedInUserQuery,
  useUpdateUserByIdMutation,
  useGetAllUsersQuery,
  useAddUserMutation,
  useDeleteUserByIdMutation,
} = authApi;
