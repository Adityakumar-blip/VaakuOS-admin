import { api } from './api';

export interface AutoResponse {
    id: string;
    keyword: string;
    action: 'opt_in' | 'opt_out';
    reply_text: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface GetAutoResponsesParams {
    search?: string;
    page?: number;
    limit?: number;
}

export interface CreateAutoResponseParams {
    keyword: string;
    action: 'opt_in' | 'opt_out';
    reply_text: string;
    is_active: boolean;
}

export interface UpdateAutoResponseParams {
    id: string;
    data: Partial<CreateAutoResponseParams>;
}

export const autoResponseApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all auto-responses
        getAutoResponses: builder.query<AutoResponse[], GetAutoResponsesParams>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.search) queryParams.append('search', params.search);
                if (params.page) queryParams.append('page', params.page.toString());
                if (params.limit) queryParams.append('limit', params.limit.toString());
                return `/auto-responses?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        { type: 'AutoResponse', id: 'LIST' },
                        ...result.map(({ id }) => ({ type: 'AutoResponse' as const, id })),
                    ]
                    : [{ type: 'AutoResponse', id: 'LIST' }],
        }),

        // Get auto-response by ID
        getAutoResponseById: builder.query<AutoResponse, string>({
            query: (id) => `/auto-responses/${id}`,
            providesTags: (result, error, id) => [{ type: 'AutoResponse', id }],
        }),

        // Create new auto-response
        addAutoResponse: builder.mutation<AutoResponse, CreateAutoResponseParams>({
            query: (data) => ({
                url: '/auto-responses',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'AutoResponse', id: 'LIST' }],
        }),

        // Update auto-response
        updateAutoResponse: builder.mutation<AutoResponse, UpdateAutoResponseParams>({
            query: ({ id, data }) => ({
                url: `/auto-responses/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AutoResponse', id },
                { type: 'AutoResponse', id: 'LIST' },
            ],
        }),

        // Delete auto-response
        deleteAutoResponse: builder.mutation<void, string>({
            query: (id) => ({
                url: `/auto-responses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'AutoResponse', id: 'LIST' }],
        }),

        // Bulk delete auto-responses
        bulkDeleteAutoResponses: builder.mutation<void, string[]>({
            query: (ids) => ({
                url: '/auto-responses/bulk-delete',
                method: 'POST',
                body: { ids },
            }),
            invalidatesTags: [{ type: 'AutoResponse', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetAutoResponsesQuery,
    useGetAutoResponseByIdQuery,
    useAddAutoResponseMutation,
    useUpdateAutoResponseMutation,
    useDeleteAutoResponseMutation,
    useBulkDeleteAutoResponsesMutation,
} = autoResponseApi;
