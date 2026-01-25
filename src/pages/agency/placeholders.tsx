import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This page is under construction.</p>
            </CardContent>
        </Card>
    </div>
);

export const AgencyTemplates = () => <PlaceholderPage title="Master Templates" description="Manage templates across all brands" />;
export const AgencyReports = () => <PlaceholderPage title="Reports & Analytics" description="Brand-wise performance reports" />;
export const AgencySettings = () => <PlaceholderPage title="Agency Settings" description="Configure agency information" />;
export const AgencyWhiteLabel = () => <PlaceholderPage title="White-Label Settings" description="Customize platform branding" />;
export const AgencyTeam = () => <PlaceholderPage title="Team & Access" description="Manage team members and permissions" />;
export const AgencyBilling = () => <PlaceholderPage title="Billing & Credits" description="Purchase credits and view invoices" />;
export const AgencyCompliance = () => <PlaceholderPage title="Compliance" description="Brand-level compliance settings" />;
export const AgencyDangerZone = () => <PlaceholderPage title="Danger Zone" description="Critical agency actions" />;
