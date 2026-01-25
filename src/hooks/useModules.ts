import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ModuleConfig, AdminType } from '@/types/admin.types';
import { 
  BRAND_MODULES, 
  AGENCY_MODULES, 
  OWNER_MODULES 
} from '@/config/modules.config';

/**
 * Hook for getting modules based on admin type and permissions
 */
export function useModules() {
  const { user, hasPermission } = useAuth();

  const modules = useMemo(() => {
    if (!user) return [];

    let allModules: ModuleConfig[] = [];

    switch (user.adminType) {
      case 'brand':
        allModules = BRAND_MODULES;
        break;
      case 'agency':
        allModules = AGENCY_MODULES;
        break;
      case 'owner':
        allModules = OWNER_MODULES;
        break;
    }

    // Filter modules based on permissions
    return filterModulesByPermissions(allModules, hasPermission);
  }, [user, hasPermission]);

  return {
    modules,
    adminType: user?.adminType,
  };
}

/**
 * Recursively filter modules based on user permissions
 */
function filterModulesByPermissions(
  modules: ModuleConfig[],
  hasPermission: (permission: string) => boolean
): ModuleConfig[] {
  return modules
    .filter(module => {
      // If no required permissions, allow access
      if (!module.requiredPermissions || module.requiredPermissions.length === 0) {
        return true;
      }

      // Check if user has any of the required permissions
      return module.requiredPermissions.some(perm => hasPermission(perm));
    })
    .map(module => {
      // Recursively filter children
      if (module.children) {
        return {
          ...module,
          children: filterModulesByPermissions(module.children, hasPermission),
        };
      }
      return module;
    });
}
