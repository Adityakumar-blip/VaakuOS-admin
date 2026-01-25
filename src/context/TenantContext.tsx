import React, { createContext, useContext, useState } from 'react';

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  domain: string;
}

interface TenantContextType {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant) => void;
}

const MOCK_TENANTS: Tenant[] = [
  { id: '1', name: 'Acme Corp', domain: 'acme.com' },
  { id: '2', name: 'TechStart Inc', domain: 'techstart.io' },
  { id: '3', name: 'Global Systems', domain: 'globalsys.net' },
];

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(MOCK_TENANTS[0]);

  return (
    <TenantContext.Provider value={{ tenants, currentTenant, setCurrentTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
