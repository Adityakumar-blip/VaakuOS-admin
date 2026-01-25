import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicSidebar } from './DynamicSidebar';
import { AppHeader } from './AppHeader';
import { SpotlightSearch } from '@/components/SpotlightSearch';
import { useTheme } from '@/context/ThemeContext';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { direction } = useTheme();
  const { isExpanded } = useSidebar();
  const isRtl = direction === 'rtl';

  return (
    <div className="min-h-screen bg-background">
      <DynamicSidebar />
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isRtl
            ? (isExpanded ? 'mr-64' : 'mr-16')
            : (isExpanded ? 'ml-64' : 'ml-16')
        )}
      >
        <AppHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <SpotlightSearch />
    </div>
  );
}
