/**
 * Comprehensive Permission Enum
 * This enum contains all permissions across Owner, Agency, and Brand tenant types
 * as provided by the backend API.
 */
export enum Permission {
  // ============================================================================
  // CONTACTS
  // ============================================================================
  CONTACTS_READ = 'contacts:read',
  CONTACTS_CREATE = 'contacts:create',
  CONTACTS_UPDATE = 'contacts:update',
  CONTACTS_DELETE = 'contacts:delete',

  // ============================================================================
  // CAMPAIGNS
  // ============================================================================
  CAMPAIGNS_READ = 'campaigns:read',
  CAMPAIGNS_CREATE = 'campaigns:create',
  CAMPAIGNS_UPDATE = 'campaigns:update',
  CAMPAIGNS_DELETE = 'campaigns:delete',
  CAMPAIGNS_EXECUTE = 'campaigns:execute',

  // ============================================================================
  // TEMPLATES
  // ============================================================================
  TEMPLATES_READ = 'templates:read',
  TEMPLATES_CREATE = 'templates:create',
  TEMPLATES_UPDATE = 'templates:update',
  TEMPLATES_DELETE = 'templates:delete',
  TEMPLATES_APPROVE = 'templates:approve',

  // ============================================================================
  // INBOX/MESSAGING
  // ============================================================================
  INBOX_READ = 'inbox:read',
  INBOX_REPLY = 'inbox:reply',
  INBOX_MANAGE = 'inbox:manage',

  // ============================================================================
  // AUTOMATION/FLOWS
  // ============================================================================
  AUTOMATION_READ = 'automation:read',
  AUTOMATION_CREATE = 'automation:create',
  AUTOMATION_UPDATE = 'automation:update',
  AUTOMATION_DELETE = 'automation:delete',

  // ============================================================================
  // INTEGRATIONS
  // ============================================================================
  INTEGRATIONS_READ = 'integrations:read',
  INTEGRATIONS_MANAGE = 'integrations:manage',

  // ============================================================================
  // SETTINGS/TENANT
  // ============================================================================
  TENANT_READ = 'tenant:read',
  TENANT_UPDATE = 'tenant:update',
  SETTINGS_MANAGE = 'settings:manage',

  // ============================================================================
  // USERS & ROLES
  // ============================================================================
  USERS_READ = 'users:read',
  USERS_MANAGE = 'users:manage',
  ROLES_MANAGE = 'roles:manage',

  // ============================================================================
  // AUTO RESPONSES
  // ============================================================================
  AUTO_RESPONSE_READ = 'auto_response:read',
  AUTO_RESPONSE_MANAGE = 'auto_response:manage',

  // ============================================================================
  // SUBSCRIPTIONS & PLANS
  // ============================================================================
  PLANS_MANAGE = 'plans:manage',
  SUBSCRIPTIONS_READ = 'subscriptions:read',

  // ============================================================================
  // ECOMMERCE/CARTS
  // ============================================================================
  ECOMMERCE_READ = 'ecommerce:read',
  ECOMMERCE_MANAGE = 'ecommerce:manage',

  // ============================================================================
  // OWNER DASHBOARD
  // ============================================================================
  OWNER_DASHBOARD_READ = 'owner_dashboard:read',

  // ============================================================================
  // AGENCIES MANAGEMENT (Owner)
  // ============================================================================
  AGENCIES_READ = 'agencies:read',
  AGENCIES_CREATE = 'agencies:create',
  AGENCIES_UPDATE = 'agencies:update',
  AGENCIES_DELETE = 'agencies:delete',
  AGENCIES_LOGIN_AS = 'agencies:login_as',

  // ============================================================================
  // BRANDS MANAGEMENT (Global - Owner)
  // ============================================================================
  BRANDS_READ = 'brands:read',
  BRANDS_CREATE = 'brands:create',
  BRANDS_UPDATE = 'brands:update',
  BRANDS_DELETE = 'brands:delete',
  BRANDS_LOGIN_AS = 'brands:login_as',

  // ============================================================================
  // OWNER BILLING & REVENUE
  // ============================================================================
  OWNER_BILLING_READ = 'owner_billing:read',
  OWNER_BILLING_MANAGE = 'owner_billing:manage',

  // ============================================================================
  // SYSTEM CONFIGURATION (Owner)
  // ============================================================================
  CONFIG_READ = 'config:read',
  CONFIG_UPDATE = 'config:update',

  // ============================================================================
  // COUPONS (Owner)
  // ============================================================================
  COUPONS_READ = 'coupons:read',
  COUPONS_CREATE = 'coupons:create',
  COUPONS_UPDATE = 'coupons:update',
  COUPONS_DELETE = 'coupons:delete',

  // ============================================================================
  // MASTER DATA (Plans, Integrations, Features, FAQs - Owner)
  // ============================================================================
  MASTER_DATA_READ = 'master_data:read',
  MASTER_DATA_MANAGE = 'master_data:manage',
  FEATURES_MANAGE = 'features:manage',

  // ============================================================================
  // EMERGENCY & MONITORING (Owner)
  // ============================================================================
  EMERGENCY_MANAGE = 'emergency:manage',
  MONITORING_READ = 'monitoring:read',

  // ============================================================================
  // OWNER TEAM
  // ============================================================================
  OWNER_TEAM_READ = 'owner_team:read',
  OWNER_TEAM_CREATE = 'owner_team:create',
  OWNER_TEAM_UPDATE = 'owner_team:update',
  OWNER_TEAM_DELETE = 'owner_team:delete',

  // ============================================================================
  // BRAND DASHBOARD
  // ============================================================================
  BRAND_DASHBOARD_READ = 'brand_dashboard:read',

  // ============================================================================
  // WHATSAPP CONFIGURATION (Brand)
  // ============================================================================
  WHATSAPP_READ = 'whatsapp:read',
  WHATSAPP_UPDATE = 'whatsapp:update',
  WHATSAPP_MANAGE = 'whatsapp:manage',

  // ============================================================================
  // BRAND TEAM/USERS
  // ============================================================================
  BRAND_TEAM_READ = 'brand_team:read',
  BRAND_TEAM_INVITE = 'brand_team:invite',
  BRAND_TEAM_UPDATE = 'brand_team:update',
  BRAND_TEAM_DELETE = 'brand_team:delete',

  // ============================================================================
  // BRAND BILLING (Payments)
  // ============================================================================
  BRAND_BILLING_READ = 'brand_billing:read',
  BRAND_BILLING_MANAGE = 'brand_billing:manage',

  // ============================================================================
  // COMPLIANCE (Brand)
  // ============================================================================
  COMPLIANCE_READ = 'compliance:read',
  COMPLIANCE_MANAGE = 'compliance:manage',

  // ============================================================================
  // WEBHOOKS (Brand)
  // ============================================================================
  WEBHOOKS_READ = 'webhooks:read',
  WEBHOOKS_CREATE = 'webhooks:create',
  WEBHOOKS_UPDATE = 'webhooks:update',
  WEBHOOKS_DELETE = 'webhooks:delete',

  // ============================================================================
  // DANGER ZONE / SETTINGS (Brand)
  // ============================================================================
  BRAND_SETTINGS_READ = 'brand_settings:read',
  BRAND_SETTINGS_UPDATE = 'brand_settings:update',
  DANGER_ZONE_MANAGE = 'danger_zone:manage',

  // ============================================================================
  // AGENCY DASHBOARD
  // ============================================================================
  AGENCY_DASHBOARD_READ = 'agency_dashboard:read',

  // ============================================================================
  // AGENCY CLIENTS/BRANDS
  // ============================================================================
  AGENCY_BRANDS_READ = 'agency_brands:read',
  AGENCY_BRANDS_CREATE = 'agency_brands:create',
  AGENCY_BRANDS_UPDATE = 'agency_brands:update',
  AGENCY_BRANDS_DELETE = 'agency_brands:delete',

  // ============================================================================
  // AGENCY TEAM
  // ============================================================================
  AGENCY_TEAM_READ = 'agency_team:read',
  AGENCY_TEAM_INVITE = 'agency_team:invite',
  AGENCY_TEAM_UPDATE = 'agency_team:update',
  AGENCY_TEAM_DELETE = 'agency_team:delete',
}

/**
 * Helper function to get all permission values as an array
 */
export const getAllPermissions = (): string[] => {
  return Object.values(Permission);
};

/**
 * Helper function to check if a string is a valid permission
 */
export const isValidPermission = (permission: string): permission is Permission => {
  return getAllPermissions().includes(permission);
};
