import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AdminUser, AdminType, AdminRole } from '@/types/admin.types';
import { getPermissionsForRole } from '@/config/permissions.config';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
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

  const login = async (email: string, _password: string, rememberMe = false) => {
    // Mock login - determine admin type based on email
    await new Promise((resolve) => setTimeout(resolve, 800));

    let mockUser: AdminUser;

    if (email.includes('owner') || email.includes('super')) {
      mockUser = MOCK_USERS.owner;
    } else if (email.includes('agency')) {
      mockUser = MOCK_USERS.agency;
    } else {
      mockUser = MOCK_USERS.brand;
    }

    // Store remember me preference
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());

    setUser({ ...mockUser, email });
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  }, []);

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
    // Mock forgot password - simulate sending reset email
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
    // In real implementation, this would call an API endpoint
  };

  const resetPassword = async (token: string, newPassword: string) => {
    // Mock reset password - simulate password reset
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Password reset with token:', token, 'New password:', newPassword);
    // In real implementation, this would call an API endpoint
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
