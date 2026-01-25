import { useAuth } from '@/context/AuthContext';

/**
 * Hook for permission checking
 */
export function usePermission() {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess: (requiredPermissions?: string[]) => {
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
      }
      return hasAnyPermission(requiredPermissions);
    },
  };
}
