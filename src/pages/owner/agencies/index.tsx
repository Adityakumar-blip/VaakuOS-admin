import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetAgenciesQuery } from '@/store/api/agencyApi';
import { Building, DollarSign, TrendingUp, Users, Loader2 } from 'lucide-react';

export default function AgenciesManagement() {
    const { data: agencies = [], isLoading, error } = useGetAgenciesQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-destructive">
                Error loading agencies. Please try again later.
            </div>
        );
    }

    const totalRevenue = agencies.reduce((acc, agency) => acc + (agency.revenue || 0), 0);
    const activeAgencies = agencies.filter(a => a.status === 'active').length;
    const suspendedAgencies = agencies.filter(a => a.status === 'suspended').length;

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
                        <div className="text-2xl font-bold">{agencies.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{activeAgencies}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{suspendedAgencies}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(1)}K</div>
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
                                        {agency.pricingTier && <Badge variant="secondary">{agency.pricingTier}</Badge>}
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
                                        {(agency.creditBalance || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Revenue Generated</p>
                                    <p className="text-lg font-semibold text-green-600 flex items-center gap-1">
                                        <TrendingUp className="h-4 w-4" />
                                        ${(agency.revenue || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Brands</p>
                                    <p className="text-lg font-semibold flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {agency.brandsCount || 0}
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

