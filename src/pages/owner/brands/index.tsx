import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MessageSquare, TrendingDown } from 'lucide-react';

export default function BrandsManagement() {
    const brands = [
        { id: '1', name: 'Acme Corp', agency: 'Digital Marketing Pro', whatsappNumber: '+1 555-0001', messageVolume: 45000, blockRate: 0.5, status: 'active' },
        { id: '2', name: 'Fashion Store', agency: 'Growth Agency', whatsappNumber: '+1 555-0002', messageVolume: 38000, blockRate: 2.3, status: 'active' },
        { id: '3', name: 'Tech Brand', agency: 'Startup Boost', whatsappNumber: '+1 555-0003', messageVolume: 12000, blockRate: 5.1, status: 'paused' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Brands Management</h1>
                    <p className="text-muted-foreground mt-2">Monitor all brands across agencies</p>
                </div>
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
                                    <CardDescription className="mt-2">Agency: {brand.agency}</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">View Details</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">WhatsApp Number</p>
                                    <p className="font-medium">{brand.whatsappNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Message Volume</p>
                                    <p className="font-semibold flex items-center gap-1">
                                        <MessageSquare className="h-4 w-4" />
                                        {brand.messageVolume.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Block Rate</p>
                                    <p className={`font-semibold flex items-center gap-1 ${brand.blockRate > 3 ? 'text-red-600' : 'text-green-600'}`}>
                                        <TrendingDown className="h-4 w-4" />
                                        {brand.blockRate}%
                                    </p>
                                </div>
                                <div>
                                    <Button variant="outline" size="sm" className="w-full">Manage</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
