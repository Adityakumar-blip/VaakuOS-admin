import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSidebar } from '@/context/SidebarContext';
import { useModules } from '@/hooks/useModules';
import { useAdminType } from '@/hooks/useAdminType';
import { ModuleConfig } from '@/types/admin.types';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export function DynamicSidebar() {
    const { collapsed, toggleCollapsed, isExpanded } = useSidebar();
    const location = useLocation();
    const { user } = useAuth();
    const { direction } = useTheme();
    const { modules } = useModules();
    const { getAdminTypeLabel } = useAdminType();

    const isRtl = direction === 'rtl';
    const [openMenus, setOpenMenus] = React.useState<string[]>([]);

    const toggleMenu = (id: string) => {
        setOpenMenus(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    React.useEffect(() => {
        modules.forEach(module => {
            if (module.children) {
                const isActiveChild = module.children.some(child =>
                    location.pathname === child.path || location.pathname.startsWith(`${child.path}/`)
                );

                if (isActiveChild) {
                    setOpenMenus(prev => {
                        if (prev.includes(module.id)) return prev;
                        return [...prev, module.id];
                    });
                }
            }
        });
    }, [location.pathname, modules]);

    // Get icon component from string name
    const getIcon = (iconName: string): React.ReactNode => {
        const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon | undefined;
        return IconComponent ? <IconComponent size={20} /> : <Icons.Circle size={20} />;
    };

    const renderModule = (module: ModuleConfig) => {
        const isActive = location.pathname === module.path;
        const hasChildren = module.children && module.children.length > 0;
        const isOpen = openMenus.includes(module.id);

        if (hasChildren) {
            return (
                <div key={module.id} className="space-y-1">
                    {isExpanded ? (
                        <div
                            onClick={() => toggleMenu(module.id)}
                            className={cn(
                                'flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
                                isOpen ? 'text-sidebar-foreground' : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="shrink-0">{getIcon(module.icon)}</span>
                                <span className={cn('whitespace-nowrap transition-all duration-300', isExpanded ? 'opacity-100' : 'opacity-0 w-0')}>
                                    {module.name}
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
                                    {getIcon(module.icon)}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side={isRtl ? "left" : "right"} className="p-0 min-w-[200px]">
                                <div className="py-2">
                                    <div className="px-3 py-2 text-sm font-semibold text-sidebar-foreground border-b border-sidebar-border/50">
                                        {module.name}
                                    </div>
                                    <div className="py-1 space-y-0.5">
                                        {module.children!.map((child) => (
                                            <NavLink
                                                key={child.id}
                                                to={child.path}
                                                className={({ isActive }) => cn(
                                                    'flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                                                    isActive
                                                        ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                                                        : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                                                )}
                                            >
                                                <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                                                {child.name}
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
                            {module.children!.map((child) => (
                                <NavLink
                                    key={child.id}
                                    to={child.path}
                                    className={({ isActive }) => cn(
                                        'block px-3 py-2 rounded-lg transition-colors truncate',
                                        isActive
                                            ? 'bg-sidebar-accent/50 text-sidebar-foreground font-medium'
                                            : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/30'
                                    )}
                                >
                                    {child.name}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        const LinkContent = (
            <NavLink
                to={module.path}
                className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative',
                    isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
            >
                <span className="shrink-0">{getIcon(module.icon)}</span>
                <span
                    className={cn(
                        'whitespace-nowrap transition-all duration-300',
                        isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                    )}
                >
                    {module.name}
                </span>
                {!isExpanded && (
                    <div className="absolute inset-0" />
                )}
            </NavLink>
        );

        if (isExpanded) {
            return <React.Fragment key={module.id}>{LinkContent}</React.Fragment>;
        }

        return (
            <Tooltip key={module.id}>
                <TooltipTrigger asChild>
                    {LinkContent}
                </TooltipTrigger>
                <TooltipContent side={isRtl ? "left" : "right"}>
                    {module.name}
                </TooltipContent>
            </Tooltip>
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
                {/* Logo & Admin Type */}
                <div className="h-16 flex items-center justify-center border-b border-sidebar-border px-4">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                            {user?.adminType === 'brand' ? 'B' : user?.adminType === 'agency' ? 'A' : 'O'}
                        </div>
                        <div
                            className={cn(
                                'transition-all duration-300',
                                isExpanded ? 'opacity-100' : 'opacity-0 w-0'
                            )}
                        >
                            <div className="font-semibold text-sidebar-foreground whitespace-nowrap text-sm">
                                {getAdminTypeLabel()}
                            </div>
                            {user?.brandName && (
                                <div className="text-xs text-sidebar-muted truncate">
                                    {user.brandName}
                                </div>
                            )}
                            {user?.agencyName && (
                                <div className="text-xs text-sidebar-muted truncate">
                                    {user.agencyName}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                    {modules.map(renderModule)}
                </nav>

                {/* Footer Section: User Info & Collapse Toggle */}
                <div className="border-t border-sidebar-border p-2 space-y-1">
                    {/* User Info */}
                    <div className={cn(
                        "flex items-center gap-3 p-2 rounded-lg transition-colors",
                        isExpanded ? "hover:bg-sidebar-accent" : "justify-center"
                    )}>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div
                            className={cn(
                                'transition-all duration-300 overflow-hidden',
                                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                            )}
                        >
                            <div className="text-sm font-medium text-sidebar-foreground truncate max-w-[150px]">
                                {user?.name}
                            </div>
                            <div className="text-xs text-sidebar-muted truncate max-w-[150px]">
                                {user?.role}
                            </div>
                        </div>
                    </div>

                    {/* Collapse Toggle */}
                    <button
                        onClick={toggleCollapsed}
                        className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-lg text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group",
                            !isExpanded && "justify-center"
                        )}
                    >
                        <div className="shrink-0 flex items-center justify-center w-5 h-5">
                            {/* Double Chevron that rotates */}
                            <div className={cn("transition-transform duration-300", collapsed ? "rotate-180" : "rotate-0")}>
                                {isRtl ? <Icons.ChevronsRight size={20} /> : <Icons.ChevronsLeft size={20} />}
                            </div>
                        </div>
                        <span
                            className={cn(
                                'whitespace-nowrap transition-all duration-300 text-sm font-medium',
                                isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                            )}
                        >
                            Collapse
                        </span>
                    </button>
                </div>
            </aside>
        </TooltipProvider>
    );
}
