import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TemplateRequests() {
    const templates = [
        {
            id: '1',
            name: 'Order Confirmation',
            category: 'Transactional',
            language: 'English',
            status: 'approved',
            submittedAt: '2024-01-15',
        },
        {
            id: '2',
            name: 'Shipping Update',
            category: 'Transactional',
            language: 'English',
            status: 'pending',
            submittedAt: '2024-01-18',
        },
        {
            id: '3',
            name: 'Promotional Offer',
            category: 'Marketing',
            language: 'English',
            status: 'rejected',
            submittedAt: '2024-01-10',
            rejectionReason: 'Template content violates WhatsApp commerce policy',
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejected
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Template Requests</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your WhatsApp message templates
                    </p>
                </div>
                <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Request New Template
                </Button>
            </div>

            <div className="grid gap-4">
                {templates.map((template) => (
                    <Card key={template.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {template.name}
                                        {getStatusBadge(template.status)}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {template.category} • {template.language}
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                    View Details
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Submitted on {new Date(template.submittedAt).toLocaleDateString()}
                                </span>
                                {template.status === 'rejected' && template.rejectionReason && (
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{template.rejectionReason}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {templates.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get started by requesting your first message template
                        </p>
                        <Button>Request Template</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
