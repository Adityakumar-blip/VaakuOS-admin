import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BrandDangerZone() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Danger Zone</h1>
                <p className="text-muted-foreground mt-2">
                    Critical actions that affect your brand
                </p>
            </div>

            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                    Actions in this section are irreversible. Please proceed with caution.
                </AlertDescription>
            </Alert>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Pause Messaging</CardTitle>
                    <CardDescription>Temporarily stop all outgoing messages</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">Pause All Messaging</Button>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Disconnect WhatsApp</CardTitle>
                    <CardDescription>Disconnect your WhatsApp Business account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">Disconnect</Button>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Delete Brand</CardTitle>
                    <CardDescription>Permanently delete this brand and all associated data</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">Delete Brand</Button>
                </CardContent>
            </Card>
        </div>
    );
}
