import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AdminUser, AdminType, AdminRole } from '@/types/admin.types';
import { TenantType, UserInfo } from '@/types/auth';
import { getPermissionsForRole } from '@/config/permissions.config';
import { useLoginMutation, useForgotPasswordMutation, useResetPasswordMutation, useLogoutMutation } from '@/store/api/authApi';
import { setSession, removeSession } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/store';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AdminUser>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  switchContext: (brandId?: string, agencyId?: string) => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

// LocalStorage keys
const AUTH_STORAGE_KEY = 'aura_admin_auth';
const REMEMBER_ME_KEY = 'aura_admin_remember';

// Mock users for different admin types
const MOCK_USERS = {
  brand: {
    id: '1',
    email: 'brand@example.com',
    name: 'Brand Admin',
    adminType: 'brand' as AdminType,
    role: 'admin' as AdminRole,
    brandId: 'brand-1',
    brandName: 'Acme Corp',
    permissions: getPermissionsForRole('brand', 'admin'),
  },
  agency: {
    id: '2',
    email: 'agency@example.com',
    name: 'Agency Owner',
    adminType: 'agency' as AdminType,
    role: 'owner' as AdminRole,
    agencyId: 'agency-1',
    agencyName: 'Digital Marketing Pro',
    permissions: getPermissionsForRole('agency', 'owner'),
  },
  owner: {
    id: '3',
    email: 'owner@example.com',
    name: 'Super Admin',
    adminType: 'owner' as AdminType,
    role: 'super_admin' as AdminRole,
    permissions: getPermissionsForRole('owner', 'super_admin'),
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // RTK Query hooks
  const [loginMutation] = useLoginMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useAppDispatch();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        // Persist session by default as per user request
        if (storedAuth) {
          const parsedUser = JSON.parse(storedAuth) as AdminUser;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to load stored auth:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string, rememberMe = false): Promise<AdminUser> => {
    try {
      // Call the real login API
      // Response contains access_token and user object
      const response = await loginMutation({ email, password }).unwrap();

      // Map the API response structure to our app's UserInfo type
      const userInfoWithRole: UserInfo = {
        ...response.user,
        // Ensure role is set if missing in API, though API usually sends it
        // If API doesn't send role for owner, we might need to deduce it or keep it as is
      };

      // Store session data in Redux (store token manually as requested)
      dispatch(setSession({
        token: response.access_token,
        userInfo: userInfoWithRole,
        permissions: [], // Default empty permissions for now
      }));

      // Store remember me preference
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());

      // Map TenantType to AdminType: 
      // internal -> owner
      // business -> brand
      // agency -> agency
      let adminType: AdminType = 'owner';
      const tenantType = response.user.tenantType;

      if (tenantType === TenantType.BUSINESS) adminType = 'brand';
      else if (tenantType === TenantType.AGENCY) adminType = 'agency';
      else if (tenantType === TenantType.INTERNAL) adminType = 'owner';

      const adminUser: AdminUser = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name || '',
        adminType: adminType,
        role: 'owner' as AdminRole, // This might need to be dynamic too based on API types if available
        permissions: [],
        brandId: undefined,
        agencyId: undefined,
      };

      setUser(adminUser);
      return adminUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      // Call backend to clear HTTP-only cookies
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      dispatch(removeSession());
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
  }, [dispatch, logoutMutation]);

  const signup = async (email: string, _password: string, name: string) => {
    // Mock signup - default to brand admin
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser: AdminUser = {
      ...MOCK_USERS.brand,
      email,
      name,
      role: 'marketer' as AdminRole,
      permissions: getPermissionsForRole('brand', 'marketer'),
    };

    localStorage.setItem(REMEMBER_ME_KEY, 'true');
    setUser(mockUser);
  };

  const forgotPassword = async (email: string) => {
    try {
      // Call the real forgot password API
      await forgotPasswordMutation({ email }).unwrap();
      // Success message will be shown by the global toast handler in api.ts
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      // Call the real reset password API
      await resetPasswordMutation({ token, newPassword }).unwrap();
      // Success message will be shown by the global toast handler in api.ts
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const switchContext = useCallback((brandId?: string, agencyId?: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      brandId,
      agencyId,
    };

    setUser(updatedUser);
  }, [user]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;

    // Check for wildcard permission
    if (user.permissions.includes('owner:*')) {
      return true;
    }

    // Check exact permission
    if (user.permissions.includes(permission)) {
      return true;
    }

    // Check wildcard patterns
    return user.permissions.some(perm => {
      if (perm.endsWith(':*')) {
        const prefix = perm.slice(0, -1);
        return permission.startsWith(prefix);
      }
      return false;
    });
  }, [user]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(perm => hasPermission(perm));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return permissions.every(perm => hasPermission(perm));
  }, [hasPermission]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
        forgotPassword,
        resetPassword,
        switchContext,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
