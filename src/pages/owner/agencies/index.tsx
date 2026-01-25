import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function AgenciesManagement() {
    const agencies = [
        {
            id: '1',
            name: 'Digital Marketing Pro',
            status: 'active',
            creditBalance: 50000,
            revenue: 12500,
            pricingTier: 'Enterprise',
            brandsCount: 12,
            createdAt: '2024-01-15',
        },
        {
            id: '2',
            name: 'Growth Agency',
            status: 'active',
            creditBalance: 35000,
            revenue: 10200,
            pricingTier: 'Professional',
            brandsCount: 8,
            createdAt: '2024-02-01',
        },
        {
            id: '3',
            name: 'Startup Boost',
            status: 'suspended',
            creditBalance: 5000,
            revenue: 2100,
            pricingTier: 'Starter',
            brandsCount: 3,
            createdAt: '2024-03-10',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agencies Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage all agencies and their subscriptions
                    </p>
                </div>
                <Button>
                    <Building className="h-4 w-4 mr-2" />
                    Add Agency
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">21</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">3</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45.2K</div>
                    </CardContent>
                </Card>
            </div>

            {/* Agencies List */}
            <div className="grid gap-4">
                {agencies.map((agency) => (
                    <Card key={agency.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-3">
                                        {agency.name}
                                        <Badge variant={agency.status === 'active' ? 'default' : 'destructive'}>
                                            {agency.status}
                                        </Badge>
                                        <Badge variant="secondary">{agency.pricingTier}</Badge>
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Created on {new Date(agency.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">View Details</Button>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Credit Balance</p>
                                    <p className="text-lg font-semibold flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        {agency.creditBalance.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Revenue Generated</p>
                                    <p className="text-lg font-semibold text-green-600 flex items-center gap-1">
                                        <TrendingUp className="h-4 w-4" />
                                        ${agency.revenue.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Brands</p>
                                    <p className="text-lg font-semibold flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {agency.brandsCount}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Actions</p>
                                    <div className="flex gap-2 mt-1">
                                        {agency.status === 'active' ? (
                                            <Button variant="destructive" size="sm">Suspend</Button>
                                        ) : (
                                            <Button variant="default" size="sm">Activate</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
