import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle2, AlertCircle, Signal } from 'lucide-react';

export default function WhatsAppConfig() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">WhatsApp Configuration</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your WhatsApp Business API settings
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Business Account
                        </CardTitle>
                        <CardDescription>
                            Your WhatsApp Business Account details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Business Number</p>
                                <p className="text-lg font-semibold">+1 (555) 123-4567</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">WABA ID</p>
                                <p className="text-lg font-mono">1234567890123456</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Quality Rating</p>
                                <Badge variant="default" className="bg-green-600">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Green
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Messaging Tier</p>
                                <Badge variant="secondary">
                                    <Signal className="h-3 w-3 mr-1" />
                                    Tier 2
                                </Badge>
                            </div>
                        </div>

                        <div className="pt-4">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Webhook Status</p>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm">Active</span>
                                <Button variant="outline" size="sm" className="ml-auto">
                                    Test Webhook
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Messaging Limits</CardTitle>
                        <CardDescription>
                            Current messaging capacity and limits
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Daily Limit</span>
                                <span className="font-medium">8,450 / 10,000</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '84.5%' }}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="text-center p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold">10,000</p>
                                <p className="text-xs text-muted-foreground mt-1">Messages/Day</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold">100,000</p>
                                <p className="text-xs text-muted-foreground mt-1">Messages/Month</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold">98.5%</p>
                                <p className="text-xs text-muted-foreground mt-1">Delivery Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Phone Number Verification</CardTitle>
                        <CardDescription>
                            Verify your business phone number
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Phone number verified</p>
                                    <p className="text-sm text-muted-foreground">Verified on Jan 15, 2024</p>
                                </div>
                            </div>
                            <Button variant="outline">Re-verify</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
