import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { toast } from 'sonner';
import { TOKEN, REFRESH_TOKEN, API_BASE_URL } from '@/utils/constants';

// Create a mutex for token refresh to prevent race conditions
const mutex = new Mutex();

// Define custom extra options type
interface CustomExtraOptions {
  skipToast?: boolean;
}

// Base query with auth headers
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom base query with token refresh logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  CustomExtraOptions
> = async (args, api, extraOptions) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Check if the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        
        if (refreshToken) {
          // Try to get a new token
          const refreshResult = await baseQuery(
            {
              url: '/auth/refresh',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            // Store the new token
            const { token, refreshToken: newRefreshToken } = refreshResult.data as {
              token: string;
              refreshToken: string;
            };
            localStorage.setItem(TOKEN, token);
            localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
            
            // Retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Refresh failed - logout user
            localStorage.clear();
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
          }
        } else {
          // No refresh token - logout user
          localStorage.clear();
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        }
      } finally {
        // Release the mutex
        release();
      }
    } else {
      // Wait for the mutex to be available
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  // Global error/success toast handling
  const skipToast = extraOptions?.skipToast;
  
  if (!skipToast) {
    if (result.error) {
      const errorData = result.error.data as { message?: string } | undefined;
      const errorMessage = errorData?.message || 'An error occurred';
      toast.error(errorMessage);
    } else if (result.data && typeof args !== 'string') {
      const method = typeof args === 'object' && 'method' in args ? args.method : 'GET';
      
      // Show success toast for mutations (POST, PUT, PATCH, DELETE)
      if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        const successData = result.data as { message?: string } | undefined;
        const successMessage = successData?.message || 'Operation successful';
        toast.success(successMessage);
      }
    }
  }

  return result;
};

// Create the base API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Role',
    'Designation',
    'Settings',
    'Masters',
  ],
  endpoints: () => ({}),
});
