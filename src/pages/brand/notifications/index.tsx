import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BrandNotifications() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your notification preferences
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose which notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Notification settings will be configured here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
