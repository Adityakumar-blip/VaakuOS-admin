import { api } from './api';

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    status: 'draft' | 'published' | 'archived';
    category_id?: string;
    meta_title?: string;
    meta_description?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    created_at: string;
    updated_at: string;
    published_at?: string;
    author_id: string;
    tenant_id: string;
    view_count: number;
    category?: BlogCategory;
    author?: {
        id: string;
        name: string;
        profile?: any;
    };
    _count?: {
        comments: number;
        analytics: number;
    };
}

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    tenant_id: string;
    created_at: string;
    updated_at: string;
    _count?: {
        blogs: number;
    };
}

export interface CreateBlogDto {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    status?: string;
    category_id?: string;
    meta_title?: string;
    meta_description?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
}

export interface UpdateBlogDto extends Partial<CreateBlogDto> { }

export interface CreateBlogCategoryDto {
    name: string;
    slug: string;
    description?: string;
}

export const blogApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Blogs
        getAdminBlogs: builder.query<Blog[], void>({
            query: () => '/blogs/admin',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Blog' as const, id })),
                        { type: 'Blog', id: 'LIST' },
                    ]
                    : [{ type: 'Blog', id: 'LIST' }],
        }),
        getBlog: builder.query<Blog, string>({
            query: (id) => `/blogs/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Blog', id }],
        }),
        createBlog: builder.mutation<Blog, CreateBlogDto>({
            query: (body) => ({
                url: '/blogs',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
        }),
        updateBlog: builder.mutation<Blog, { id: string; body: UpdateBlogDto }>({
            query: ({ id, body }) => ({
                url: `/blogs/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Blog', id },
                { type: 'Blog', id: 'LIST' },
            ],
        }),
        deleteBlog: builder.mutation<void, string>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
        }),

        // Categories
        getCategories: builder.query<BlogCategory[], void>({
            query: () => '/blogs/categories',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'BlogCategory' as const, id })),
                        { type: 'BlogCategory', id: 'LIST' },
                    ]
                    : [{ type: 'BlogCategory', id: 'LIST' }],
        }),
        createCategory: builder.mutation<BlogCategory, CreateBlogCategoryDto>({
            query: (body) => ({
                url: '/blogs/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'BlogCategory', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetAdminBlogsQuery,
    useGetBlogQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useGetCategoriesQuery,
    useCreateCategoryMutation,
} = blogApi;
