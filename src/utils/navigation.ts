import { TenantType } from "@/types/auth";

/**
 * Get the dashboard route based on tenant type
 * @param tenantType - The type of tenant (agency, business, internal)
 * @returns The dashboard route path
 */
export function getDashboardRoute(tenantType: TenantType): string {
  switch (tenantType) {
    case TenantType.AGENCY:
      return "/agency/dashboard";
    case TenantType.BUSINESS:
      return "/brand/dashboard";
    case TenantType.INTERNAL:
      return "/owner/dashboard";
    default:
      return "/";
  }
}

/**
 * Get the home route based on tenant type
 * This is used for navigation after login
 */
export function getHomeRoute(tenantType: TenantType): string {
  return getDashboardRoute(tenantType);
}
