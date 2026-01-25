import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Building2, Globe, Clock, Languages } from 'lucide-react';

export default function BrandSettings() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Brand Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your brand information and preferences
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Basic Information
                        </CardTitle>
                        <CardDescription>
                            Update your brand's basic details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="brand-name">Brand Name</Label>
                            <Input id="brand-name" defaultValue={user?.brandName} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="website">Website URL</Label>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <Input id="website" placeholder="https://example.com" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Select>
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                                    <SelectItem value="saas">SaaS</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of your brand"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Regional Settings
                        </CardTitle>
                        <CardDescription>
                            Configure timezone and language preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select>
                                <SelectTrigger id="timezone">
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="utc">UTC</SelectItem>
                                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                                    <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="language">Default Language</Label>
                            <div className="flex items-center gap-2">
                                <Languages className="h-4 w-4 text-muted-foreground" />
                                <Select>
                                    <SelectTrigger id="language">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                        <SelectItem value="hi">Hindi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
