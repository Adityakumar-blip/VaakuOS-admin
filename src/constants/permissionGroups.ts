import { Permission } from '@/types/permissions.enum';

/**
 * Permission Group Interface
 */
export interface PermissionGroup {
  id: string;
  label: string;
  description: string;
  permissions: Permission[];
}

/**
 * Permission Groups organized by category
 * This structure is used for the role creation/editing UI
 */
export const permissionGroups: PermissionGroup[] = [
  // ============================================================================
  // OWNER PERMISSIONS
  // ============================================================================
  {
    id: 'owner-dashboard',
    label: 'Owner Dashboard',
    description: 'Access to owner dashboard and analytics',
    permissions: [Permission.OWNER_DASHBOARD_READ],
  },
  {
    id: 'agencies',
    label: 'Agencies Management',
    description: 'Manage agencies and their access',
    permissions: [
      Permission.AGENCIES_READ,
      Permission.AGENCIES_CREATE,
      Permission.AGENCIES_UPDATE,
      Permission.AGENCIES_DELETE,
      Permission.AGENCIES_LOGIN_AS,
    ],
  },
  {
    id: 'brands-global',
    label: 'Brands Management (Global)',
    description: 'Manage all brands across the platform',
    permissions: [
      Permission.BRANDS_READ,
      Permission.BRANDS_CREATE,
      Permission.BRANDS_UPDATE,
      Permission.BRANDS_DELETE,
      Permission.BRANDS_LOGIN_AS,
    ],
  },
  {
    id: 'owner-billing',
    label: 'Owner Billing & Revenue',
    description: 'Manage platform billing and revenue',
    permissions: [
      Permission.OWNER_BILLING_READ,
      Permission.OWNER_BILLING_MANAGE,
    ],
  },
  {
    id: 'system-config',
    label: 'System Configuration',
    description: 'Configure system settings and parameters',
    permissions: [
      Permission.CONFIG_READ,
      Permission.CONFIG_UPDATE,
    ],
  },
  {
    id: 'coupons',
    label: 'Coupons',
    description: 'Manage discount coupons and promotions',
    permissions: [
      Permission.COUPONS_READ,
      Permission.COUPONS_CREATE,
      Permission.COUPONS_UPDATE,
      Permission.COUPONS_DELETE,
    ],
  },
  {
    id: 'master-data',
    label: 'Master Data',
    description: 'Manage plans, integrations, features, and FAQs',
    permissions: [
      Permission.MASTER_DATA_READ,
      Permission.MASTER_DATA_MANAGE,
      Permission.FEATURES_MANAGE,
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring & Emergency',
    description: 'System monitoring and emergency controls',
    permissions: [
      Permission.MONITORING_READ,
      Permission.EMERGENCY_MANAGE,
    ],
  },
  {
    id: 'owner-team',
    label: 'Owner Team',
    description: 'Manage owner team members',
    permissions: [
      Permission.OWNER_TEAM_READ,
      Permission.OWNER_TEAM_CREATE,
      Permission.OWNER_TEAM_UPDATE,
      Permission.OWNER_TEAM_DELETE,
    ],
  },

  // ============================================================================
  // BRAND PERMISSIONS
  // ============================================================================
  {
    id: 'brand-dashboard',
    label: 'Brand Dashboard',
    description: 'Access to brand dashboard',
    permissions: [Permission.BRAND_DASHBOARD_READ],
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Configuration',
    description: 'Configure WhatsApp integration',
    permissions: [
      Permission.WHATSAPP_READ,
      Permission.WHATSAPP_UPDATE,
      Permission.WHATSAPP_MANAGE,
    ],
  },
  {
    id: 'brand-team',
    label: 'Brand Team',
    description: 'Manage brand team members',
    permissions: [
      Permission.BRAND_TEAM_READ,
      Permission.BRAND_TEAM_INVITE,
      Permission.BRAND_TEAM_UPDATE,
      Permission.BRAND_TEAM_DELETE,
    ],
  },
  {
    id: 'brand-billing',
    label: 'Brand Billing',
    description: 'Manage brand payments and invoices',
    permissions: [
      Permission.BRAND_BILLING_READ,
      Permission.BRAND_BILLING_MANAGE,
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    description: 'Manage compliance and regulations',
    permissions: [
      Permission.COMPLIANCE_READ,
      Permission.COMPLIANCE_MANAGE,
    ],
  },
  {
    id: 'webhooks',
    label: 'Webhooks',
    description: 'Configure and manage webhooks',
    permissions: [
      Permission.WEBHOOKS_READ,
      Permission.WEBHOOKS_CREATE,
      Permission.WEBHOOKS_UPDATE,
      Permission.WEBHOOKS_DELETE,
    ],
  },
  {
    id: 'brand-settings',
    label: 'Brand Settings',
    description: 'Manage brand settings and danger zone',
    permissions: [
      Permission.BRAND_SETTINGS_READ,
      Permission.BRAND_SETTINGS_UPDATE,
      Permission.DANGER_ZONE_MANAGE,
    ],
  },

  // ============================================================================
  // AGENCY PERMISSIONS
  // ============================================================================
  {
    id: 'agency-dashboard',
    label: 'Agency Dashboard',
    description: 'Access to agency dashboard',
    permissions: [Permission.AGENCY_DASHBOARD_READ],
  },
  {
    id: 'agency-brands',
    label: 'Agency Brands',
    description: 'Manage brands under agency',
    permissions: [
      Permission.AGENCY_BRANDS_READ,
      Permission.AGENCY_BRANDS_CREATE,
      Permission.AGENCY_BRANDS_UPDATE,
      Permission.AGENCY_BRANDS_DELETE,
    ],
  },
  {
    id: 'agency-team',
    label: 'Agency Team',
    description: 'Manage agency team members',
    permissions: [
      Permission.AGENCY_TEAM_READ,
      Permission.AGENCY_TEAM_INVITE,
      Permission.AGENCY_TEAM_UPDATE,
      Permission.AGENCY_TEAM_DELETE,
    ],
  },

  // ============================================================================
  // COMMON PERMISSIONS (Shared across tenant types)
  // ============================================================================
  {
    id: 'contacts',
    label: 'Contacts',
    description: 'Manage customer contacts',
    permissions: [
      Permission.CONTACTS_READ,
      Permission.CONTACTS_CREATE,
      Permission.CONTACTS_UPDATE,
      Permission.CONTACTS_DELETE,
    ],
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    description: 'Create and manage marketing campaigns',
    permissions: [
      Permission.CAMPAIGNS_READ,
      Permission.CAMPAIGNS_CREATE,
      Permission.CAMPAIGNS_UPDATE,
      Permission.CAMPAIGNS_DELETE,
      Permission.CAMPAIGNS_EXECUTE,
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    description: 'Manage message templates',
    permissions: [
      Permission.TEMPLATES_READ,
      Permission.TEMPLATES_CREATE,
      Permission.TEMPLATES_UPDATE,
      Permission.TEMPLATES_DELETE,
      Permission.TEMPLATES_APPROVE,
    ],
  },
  {
    id: 'inbox',
    label: 'Inbox & Messaging',
    description: 'Manage customer conversations',
    permissions: [
      Permission.INBOX_READ,
      Permission.INBOX_REPLY,
      Permission.INBOX_MANAGE,
    ],
  },
  {
    id: 'automation',
    label: 'Automation & Flows',
    description: 'Create and manage automation workflows',
    permissions: [
      Permission.AUTOMATION_READ,
      Permission.AUTOMATION_CREATE,
      Permission.AUTOMATION_UPDATE,
      Permission.AUTOMATION_DELETE,
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'Manage third-party integrations',
    permissions: [
      Permission.INTEGRATIONS_READ,
      Permission.INTEGRATIONS_MANAGE,
    ],
  },
  {
    id: 'tenant-settings',
    label: 'Tenant & Settings',
    description: 'Manage tenant configuration',
    permissions: [
      Permission.TENANT_READ,
      Permission.TENANT_UPDATE,
      Permission.SETTINGS_MANAGE,
    ],
  },
  {
    id: 'users-roles',
    label: 'Users & Roles',
    description: 'Manage users and role assignments',
    permissions: [
      Permission.USERS_READ,
      Permission.USERS_MANAGE,
      Permission.ROLES_MANAGE,
    ],
  },
  {
    id: 'auto-response',
    label: 'Auto Responses',
    description: 'Configure automated responses',
    permissions: [
      Permission.AUTO_RESPONSE_READ,
      Permission.AUTO_RESPONSE_MANAGE,
    ],
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions & Plans',
    description: 'Manage subscriptions and pricing plans',
    permissions: [
      Permission.PLANS_MANAGE,
      Permission.SUBSCRIPTIONS_READ,
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    description: 'Manage e-commerce features and carts',
    permissions: [
      Permission.ECOMMERCE_READ,
      Permission.ECOMMERCE_MANAGE,
    ],
  },
];

/**
 * Get permission groups filtered by tenant type
 */
export const getPermissionGroupsByTenantType = (tenantType: 'owner' | 'agency' | 'brand'): PermissionGroup[] => {
  const tenantSpecificGroups: Record<string, string[]> = {
    owner: ['owner-dashboard', 'agencies', 'brands-global', 'owner-billing', 'system-config', 'coupons', 'master-data', 'monitoring', 'owner-team'],
    agency: ['agency-dashboard', 'agency-brands', 'agency-team'],
    brand: ['brand-dashboard', 'whatsapp', 'brand-team', 'brand-billing', 'compliance', 'webhooks', 'brand-settings'],
  };

  const commonGroupIds = ['contacts', 'campaigns', 'templates', 'inbox', 'automation', 'integrations', 'tenant-settings', 'users-roles', 'auto-response', 'subscriptions', 'ecommerce'];
  const specificGroupIds = tenantSpecificGroups[tenantType] || [];

  return permissionGroups.filter(group => 
    specificGroupIds.includes(group.id) || commonGroupIds.includes(group.id)
  );
};
