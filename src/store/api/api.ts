import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { toast } from 'sonner';
import { API_BASE_URL, TOKEN, REFRESH_TOKEN } from '@/utils/constants';

// Create a mutex for token refresh to prevent race conditions
const mutex = new Mutex();

// Define custom extra options type
interface CustomExtraOptions {
  skipToast?: boolean;
}

// Base query with credentials for cookie-based auth (hybrid approach)
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include', // Send cookies if available
  prepareHeaders: (headers) => {
    // Check for token in localStorage (manual override)
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
        // Try to refresh the token using HTTP-only cookie
        // Backend reads refreshToken from cookie and sets new accessToken cookie
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Update the token in localStorage so the retry picks it up
          const refreshData = refreshResult.data as { access_token?: string };
          if (refreshData.access_token) {
             localStorage.setItem(TOKEN, refreshData.access_token);
          }

          // Cookies are refreshed by backend automatically
          // Just retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed - logout user
          // Call backend to clear cookies
          await baseQuery(
            { url: '/auth/logout', method: 'POST' },
            api,
            extraOptions
          );
          localStorage.clear();
          
          if (window.location.pathname !== '/login') {
             window.location.href = '/login';
             toast.error('Session expired. Please login again.');
          }
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
    'AutoResponse',
  ],
  endpoints: () => ({}),
});
