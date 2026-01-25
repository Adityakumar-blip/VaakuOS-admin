import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AdminType } from '@/types/admin.types';

interface AdminTypeGuardProps {
    allowedAdminTypes: AdminType[];
    fallback?: React.ReactNode;
    redirectTo?: string;
    children: React.ReactNode;
}

/**
 * Guard component that restricts access based on admin type
 */
export function AdminTypeGuard({
    allowedAdminTypes,
    fallback,
    redirectTo,
    children,
}: AdminTypeGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Show loading state while checking auth
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user's admin type is allowed
    const isAllowed = allowedAdminTypes.includes(user.adminType);

    if (!isAllowed) {
        if (redirectTo) {
            return <Navigate to={redirectTo} replace />;
        }

        if (fallback) {
            return <>{fallback}</>;
        }

        // Default: redirect to appropriate dashboard
        const defaultRoute = getDefaultRouteForAdminType(user.adminType);
        return <Navigate to={defaultRoute} replace />;
    }

    return <>{children}</>;
}

/**
 * Get default route based on admin type
 */
function getDefaultRouteForAdminType(adminType: AdminType): string {
    switch (adminType) {
        case 'brand':
            return '/brand/dashboard';
        case 'agency':
            return '/agency/dashboard';
        case 'owner':
            return '/owner/dashboard';
        default:
            return '/';
    }
}
