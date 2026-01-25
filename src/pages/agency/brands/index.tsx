import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus } from 'lucide-react';

export default function AgencyBrands() {
    const brands = [
        { id: '1', name: 'Acme Corp', status: 'active', assignedCredits: 15000, messagesSent: 45000, createdAt: '2024-01-15' },
        { id: '2', name: 'Fashion Store', status: 'active', assignedCredits: 12000, messagesSent: 38000, createdAt: '2024-02-01' },
        { id: '3', name: 'Tech Brand', status: 'paused', assignedCredits: 5000, messagesSent: 12000, createdAt: '2024-03-10' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
                    <p className="text-muted-foreground mt-2">Manage your agency's brands</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Brand
                </Button>
            </div>

            <div className="grid gap-4">
                {brands.map((brand) => (
                    <Card key={brand.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-3">
                                        <Building2 className="h-5 w-5" />
                                        {brand.name}
                                        <Badge variant={brand.status === 'active' ? 'default' : 'secondary'}>{brand.status}</Badge>
                                    </CardTitle>
                                    <CardDescription className="mt-2">Created {new Date(brand.createdAt).toLocaleDateString()}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Switch</Button>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Assigned Credits</p>
                                    <p className="text-lg font-semibold">{brand.assignedCredits.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Messages Sent</p>
                                    <p className="text-lg font-semibold">{brand.messagesSent.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Button variant={brand.status === 'active' ? 'destructive' : 'default'} size="sm">
                                        {brand.status === 'active' ? 'Pause' : 'Activate'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
