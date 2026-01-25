import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Building, Building2, MessageSquare, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export default function OwnerDashboard() {
    const { user } = useAuth();

    const stats = [
        {
            title: 'Total Agencies',
            value: '24',
            change: '+3 this month',
            icon: Building,
            color: 'text-blue-600',
        },
        {
            title: 'Total Brands',
            value: '156',
            change: '+12 this month',
            icon: Building2,
            color: 'text-green-600',
        },
        {
            title: 'Messages Today',
            value: '1.2M',
            change: '+8.5%',
            icon: MessageSquare,
            color: 'text-purple-600',
        },
        {
            title: 'Revenue (MTD)',
            value: '$45,230',
            change: '+15.3%',
            icon: DollarSign,
            color: 'text-orange-600',
        },
    ];

    const alerts = [
        {
            type: 'warning',
            message: 'High opt-out rate detected for Brand "Fashion Store"',
            time: '10 minutes ago',
        },
        {
            type: 'info',
            message: 'New agency "Marketing Pro" registered',
            time: '1 hour ago',
        },
        {
            type: 'critical',
            message: 'Quality rating dropped to Yellow for "Tech Brand"',
            time: '2 hours ago',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Global Overview</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back, {user?.name}! System-wide metrics and alerts.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* System Alerts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            System Alerts
                        </CardTitle>
                        <CardDescription>Recent system-wide notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {alerts.map((alert, index) => (
                                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${alert.type === 'critical' ? 'bg-red-600' :
                                            alert.type === 'warning' ? 'bg-orange-600' :
                                                'bg-blue-600'
                                        }`} />
                                    <div className="flex-1">
                                        <p className="text-sm">{alert.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Agencies</CardTitle>
                        <CardDescription>By message volume this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: 'Digital Marketing Pro', messages: '450K', revenue: '$12,500' },
                                { name: 'Growth Agency', messages: '380K', revenue: '$10,200' },
                                { name: 'Brand Builders', messages: '320K', revenue: '$8,900' },
                            ].map((agency, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div>
                                        <p className="font-medium">{agency.name}</p>
                                        <p className="text-sm text-muted-foreground">{agency.messages} messages</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">{agency.revenue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Failed Messages %</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">1.8%</div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: '1.8%' }}></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Quality Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">3</div>
                        <p className="text-xs text-muted-foreground mt-1">Brands requiring attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground mt-1">Template moderation queue</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
