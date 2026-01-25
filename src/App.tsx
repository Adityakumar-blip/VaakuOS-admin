import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { TenantProvider } from "@/context/TenantContext";
import { AuthProvider } from "@/context/AuthContext";
import { SpotlightProvider } from "@/context/SpotlightContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminTypeGuard } from "@/components/guards/AdminTypeGuard";
import ComponentShowcase from "@/pages/ComponentShowcase";
import Settings from "@/pages/Settings";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/NotFound";
import { AutoRoutes } from "@/components/routing/AutoRoutes";

// Brand Admin Pages (Auto-discovered)
// Owner Admin Pages (Auto-discovered)
// Agency Admin Pages (Auto-discovered)
// Brand Admin Team Pages (Users & Roles) (Auto-discovered)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TenantProvider>
        <AuthProvider>
          <SpotlightProvider>
            <SidebarProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected Routes */}
                    <Route element={<AppLayout />}>
                      {/* Brand Admin Routes */}
                      <Route path="/brand/*" element={
                        <AdminTypeGuard allowedAdminTypes={['brand']}>
                          <AutoRoutes basePath="brand" />
                        </AdminTypeGuard>
                      } />

                      {/* Agency Admin Routes */}
                      <Route path="/agency/*" element={
                        <AdminTypeGuard allowedAdminTypes={['agency']}>
                          <AutoRoutes basePath="agency" />
                        </AdminTypeGuard>
                      } />

                      {/* Owner Admin Routes */}
                      <Route path="/owner/*" element={
                        <AdminTypeGuard allowedAdminTypes={['owner']}>
                          <AutoRoutes basePath="owner" />
                        </AdminTypeGuard>
                      } />

                      {/* Component Showcase */}
                      <Route path="/components" element={<ComponentShowcase />} />

                      {/* Profile - Accessible to all authenticated users */}
                      <Route path="/profile" element={<ProfilePage />} />

                      {/* Global Settings */}
                      <Route path="/settings" element={<Settings />} />

                      {/* Root redirect based on admin type */}
                      <Route path="/" element={<Navigate to="/brand/dashboard" replace />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </SidebarProvider>
          </SpotlightProvider>
        </AuthProvider>
      </TenantProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
