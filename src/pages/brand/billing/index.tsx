import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp, Download, Plus } from 'lucide-react';

export default function CreditsAndBilling() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Credits & Billing</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your credits and view billing information
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Purchase Credits
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">5,420</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Approximately 5,420 messages
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Professional</div>
                        <Badge variant="secondary" className="mt-2">Active</Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$245</div>
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>+12% from last month</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Usage Breakdown</CardTitle>
                    <CardDescription>Credit usage for the current month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Messages Sent</span>
                            <span className="font-medium">2,340 credits</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Messages Delivered</span>
                            <span className="font-medium">2,298 credits</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '64%' }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Messages Failed</span>
                            <span className="font-medium">42 credits</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: '1.2%' }}></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Invoice History</CardTitle>
                            <CardDescription>Download your past invoices</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            View All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { id: 'INV-001', date: '2024-01-01', amount: '$245.00', status: 'paid' },
                            { id: 'INV-002', date: '2023-12-01', amount: '$218.00', status: 'paid' },
                            { id: 'INV-003', date: '2023-11-01', amount: '$195.00', status: 'paid' },
                        ].map((invoice) => (
                            <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div>
                                    <p className="font-medium">{invoice.id}</p>
                                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold">{invoice.amount}</span>
                                    <Badge variant="secondary">Paid</Badge>
                                    <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
