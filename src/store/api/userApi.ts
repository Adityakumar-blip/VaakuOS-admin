import { api } from './api';
import { Role } from './roleApi';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  password?: string;
  role?: string | Role;
  user_roles?: { roles: Role }[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}


export interface GetUsersParams {
  search?: string;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<User[], GetUsersParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        return `/users?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
            { type: 'User', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'User' as const, id })),
          ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Add new user
    addUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Update user
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id: 'LIST' },
        { type: 'User', id },
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
