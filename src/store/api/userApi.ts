import { api } from './api';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  data: User[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface GetUsersParams {
  page?: number;
  take?: number;
  search?: string;
  filters?: Record<string, string | number | boolean | null | undefined>;
}

export interface DeleteUsersParams {
  ids: string[];
  selectAll?: boolean;
  excludedIds?: string[];
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get users with pagination
    getUsers: builder.query<UsersResponse, GetUsersParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.take) queryParams.append('take', params.take.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.filters) {
          Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
        }
        return `/user/get?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'User', id: 'LIST' },
              ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/user/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Add new user
    addUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/user/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Update user
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id: 'LIST' },
        { type: 'User', id },
      ],
    }),

    // Delete user(s) - supports both single and bulk delete
    deleteUsers: builder.mutation<void, DeleteUsersParams>({
      query: (params) => ({
        url: '/user/delete',
        method: 'DELETE',
        body: params,
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
  useDeleteUsersMutation,
} = userApi;
