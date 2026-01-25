import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Building2, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';

export default function AgencyDashboard() {
    const { user } = useAuth();

    const stats = [
        { title: 'Total Brands', value: '12', change: '+2 this month', icon: Building2, color: 'text-blue-600' },
        { title: 'Messages Sent', value: '450K', change: '+12.5%', icon: MessageSquare, color: 'text-green-600' },
        { title: 'Revenue Recovered', value: '$12,500', change: '+15.3%', icon: DollarSign, color: 'text-purple-600' },
        { title: 'Credit Balance', value: '50,000', change: '-5,200 this month', icon: TrendingUp, color: 'text-orange-600' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Agency Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back, {user?.name}! Here's your agency overview for {user?.agencyName}.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.change}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Brands</CardTitle>
                        <CardDescription>Your managed brands</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { name: 'Acme Corp', status: 'active', messages: '45K' },
                                { name: 'Fashion Store', status: 'active', messages: '38K' },
                                { name: 'Tech Brand', status: 'paused', messages: '12K' },
                            ].map((brand, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div>
                                        <p className="font-medium">{brand.name}</p>
                                        <p className="text-sm text-muted-foreground">{brand.messages} messages</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${brand.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {brand.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-sm">
                                <p className="font-medium">New brand "Fashion Store" added</p>
                                <p className="text-muted-foreground">2 hours ago</p>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">Template approved for Acme Corp</p>
                                <p className="text-muted-foreground">5 hours ago</p>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">Credits purchased: 10,000</p>
                                <p className="text-muted-foreground">Yesterday</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
