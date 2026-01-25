import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BrandWebhooks() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Webhooks & API</h1>
                <p className="text-muted-foreground mt-2">
                    Configure webhooks and manage API keys
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Webhook Configuration</CardTitle>
                    <CardDescription>Set up webhooks for real-time event notifications</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Webhook configuration will be available here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
