import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  User,
  Component,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSidebar } from '@/context/SidebarContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles?: string[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
  {
    label: 'System',
    icon: <Shield size={20} />,
    href: '/system',
    children: [
      { label: 'User', icon: <User size={20} />, href: '/system/users' },
      { label: 'Role', icon: <Lock size={20} />, href: '/system/roles' },
    ]
  },
  { label: 'Profile', icon: <User size={20} />, href: '/profile' },
  { label: 'Components', icon: <Component size={20} />, href: '/components' },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];

export function AppSidebar() {
  const { collapsed, toggleCollapsed, isExpanded } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const { direction } = useTheme();

  const isRtl = direction === 'rtl';

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed top-0 h-screen bg-sidebar border-sidebar-border z-40 transition-all duration-300 ease-in-out flex flex-col',
          isRtl ? 'right-0 border-l' : 'left-0 border-r',
          isExpanded ? 'w-64' : 'w-16'
        )}
      >
        {/* Legacy Collapse Button Helper - visible mostly on the border */}
        <button
          onClick={toggleCollapsed}
          className={cn(
            'absolute top-6 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300',
            isRtl ? '-left-3.5' : '-right-3.5'
          )}
        >
          {isRtl ? (
            collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
          ) : (
            collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
          )}
        </button>

        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
              AP
            </div>
            <span
              className={cn(
                'font-semibold text-sidebar-foreground whitespace-nowrap transition-all duration-300',
                isExpanded ? 'opacity-100' : 'opacity-0 w-0'
              )}
            >
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus.includes(item.label);

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-1">
                  {isExpanded ? (
                    <div
                      onClick={() => toggleMenu(item.label)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
                        isOpen ? 'text-sidebar-foreground' : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="shrink-0">{item.icon}</span>
                        <span className={cn('whitespace-nowrap transition-all duration-300', isExpanded ? 'opacity-100' : 'opacity-0 w-0')}>
                          {item.label}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={cn('transition-transform duration-200', isOpen ? 'rotate-180' : '')}
                      />
                    </div>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center justify-center py-2.5 rounded-lg text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                        >
                          {item.icon}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side={isRtl ? "left" : "right"} className="p-0 min-w-[200px]">
                        <div className="py-2">
                          <div className="px-3 py-2 text-sm font-semibold text-sidebar-foreground border-b border-sidebar-border/50">
                            {item.label}
                          </div>
                          <div className="py-1 space-y-0.5">
                            {item.children!.map((child) => (
                              <NavLink
                                key={child.href}
                                to={child.href}
                                className={({ isActive }) => cn(
                                  'flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                                  isActive
                                    ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                                    : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                                )}
                              >
                                <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                                {child.label}
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Submenu */}
                  {isOpen && isExpanded && (
                    <div className="ml-9 space-y-1 text-sm border-l border-sidebar-border/50 pl-2">
                      {item.children!.map((child) => (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          className={({ isActive }) => cn(
                            'block px-3 py-2 rounded-lg transition-colors truncate',
                            isActive
                              ? 'bg-sidebar-accent/50 text-sidebar-foreground font-medium'
                              : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/30'
                          )}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const LinkContent = (
              <NavLink
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                <span
                  className={cn(
                    'whitespace-nowrap transition-all duration-300',
                    isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                  )}
                >
                  {item.label}
                </span>
                {!isExpanded && (
                  <div className="absolute inset-0" />
                )}
              </NavLink>
            );

            if (isExpanded) {
              return <React.Fragment key={item.href}>{LinkContent}</React.Fragment>;
            }

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  {LinkContent}
                </TooltipTrigger>
                <TooltipContent side={isRtl ? "left" : "right"}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
