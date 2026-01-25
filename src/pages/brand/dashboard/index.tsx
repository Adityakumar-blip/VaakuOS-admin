import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, MessageSquare, FileText, CreditCard, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { LineChartWidget } from '@/components/dashboard/LineChartWidget';
import { PieChartWidget } from '@/components/dashboard/PieChartWidget';
import { BarChartWidget } from '@/components/dashboard/BarChartWidget';
import { CircularChartWidget } from '@/components/dashboard/CircularChartWidget';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';

export default function BrandDashboard() {
    const { user } = useAuth();

    const stats = [
        {
            title: 'Messages Sent',
            value: '12,543',
            change: '+12.5%',
            icon: MessageSquare,
            color: 'text-blue-600',
        },
        {
            title: 'Active Templates',
            value: '24',
            change: '+3',
            icon: FileText,
            color: 'text-green-600',
        },
        {
            title: 'Credit Balance',
            value: '5,420',
            change: '-230',
            icon: CreditCard,
            color: 'text-orange-600',
        },
        {
            title: 'Delivery Rate',
            value: '98.2%',
            change: '+0.3%',
            icon: TrendingUp,
            color: 'text-purple-600',
        },
    ];

    const kpiData = [
        {
            title: 'Total Revenue',
            value: '$45,231.89',
            change: '+20.1%',
            trend: 'up' as const,
            icon: <DollarSign size={20} />,
        },
        {
            title: 'Active Users',
            value: '2,350',
            change: '+180',
            trend: 'up' as const,
            icon: <Users size={20} />,
        },
        {
            title: 'Orders',
            value: '12,234',
            change: '-3.2%',
            trend: 'down' as const,
            icon: <ShoppingCart size={20} />,
        },
        {
            title: 'Growth Rate',
            value: '+12.5%',
            change: '+2.1%',
            trend: 'up' as const,
            icon: <TrendingUp size={20} />,
        },
    ];


    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Brand Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome back, {user?.name}! Here's what's happening with {user?.brandName}.
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
                                        {stat.change} from last month
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Campaigns</CardTitle>
                            <CardDescription>Your latest WhatsApp campaigns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Summer Sale Announcement</p>
                                        <p className="text-xs text-muted-foreground">Sent 2 hours ago</p>
                                    </div>
                                    <div className="text-sm text-green-600">98% delivered</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Product Launch</p>
                                        <p className="text-xs text-muted-foreground">Sent yesterday</p>
                                    </div>
                                    <div className="text-sm text-green-600">97% delivered</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Customer Feedback Request</p>
                                        <p className="text-xs text-muted-foreground">Sent 3 days ago</p>
                                    </div>
                                    <div className="text-sm text-green-600">99% delivered</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks and shortcuts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="h-4 w-4" />
                                        <span className="text-sm font-medium">Create New Campaign</span>
                                    </div>
                                </button>
                                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm font-medium">Request Template</span>
                                    </div>
                                </button>
                                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-4 w-4" />
                                        <span className="text-sm font-medium">Purchase Credits</span>
                                    </div>
                                </button>
                                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Users className="h-4 w-4" />
                                        <span className="text-sm font-medium">Invite Team Member</span>
                                    </div>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back! Here's what's happening with {user?.brandName}.
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiData.map((kpi) => (
                        <KpiCard key={kpi.title} {...kpi} />
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <LineChartWidget />
                    </div>
                    <div>
                        <PieChartWidget />
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <BarChartWidget />
                    </div>
                    <div>
                        <CircularChartWidget />
                    </div>
                </div>

                {/* Transactions Table */}
                <RecentTransactionsTable />
            </div>
        </>
    );
}
