import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BrandCompliance() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Compliance & Safety</h1>
                <p className="text-muted-foreground mt-2">
                    Configure compliance settings and safety features
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Compliance Settings</CardTitle>
                    <CardDescription>Manage opt-out keywords, quiet hours, and data retention</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Compliance settings will be configured here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
