import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import { ArrowLeft, Edit } from 'lucide-react';
import { userService, type User } from '@/services/userService';
import { toast } from 'sonner';

export default function OwnerCreateUserPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const action = searchParams.get('action'); // 'edit' | 'view' | null (add)

    const isViewMode = action === 'view';
    const isEditMode = action === 'edit';
    const isAddMode = !id;

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        isActive: true,
        role: 'user', // Default role
    });

    useEffect(() => {
        if (id) {
            const user = userService.getUserById(id);
            if (user) {
                setFormData({
                    fullName: user.name,
                    email: user.email,
                    password: '', // Don't show password on edit
                    phone: user.phone || '',
                    isActive: user.status === 'active',
                    role: user.role,
                });
            } else {
                toast.error('User not found');
                navigate('/owner/team/user');
            }
        }
    }, [id, navigate]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        try {
            if (isAddMode) {
                userService.createUser({
                    name: formData.fullName,
                    email: formData.email,
                    role: formData.role as User['role'],
                    status: formData.isActive ? 'active' : 'inactive',
                    phone: formData.phone,
                });
                toast.success('User created successfully');
            } else if (isEditMode && id) {
                userService.updateUser(id, {
                    name: formData.fullName,
                    email: formData.email,
                    role: formData.role as User['role'],
                    status: formData.isActive ? 'active' : 'inactive',
                    phone: formData.phone,
                });
                toast.success('User updated successfully');
            }
            navigate('/owner/team/user');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save user');
        }
    };

    const getTitle = () => {
        if (isViewMode) return 'User Details';
        if (isEditMode) return 'Edit User';
        return 'Add New User';
    };

    return (
        <div className="p-6 space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/owner/team/user')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">{getTitle()}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/owner/team/user')}>
                        {isViewMode ? 'Back' : 'Cancel'}
                    </Button>

                    {!isViewMode && (
                        <Button onClick={handleSubmit}>
                            {isEditMode ? 'Update User' : 'Create User'}
                        </Button>
                    )}

                    {isViewMode && id && (
                        <Button onClick={() => navigate(`/owner/team/user/create?id=${id}&action=edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </Button>
                    )}
                </div>
            </div>

            <Card>
                <CardContent className="p-6 space-y-4 max-w-2xl">
                    <div className="space-y-2">
                        <Label htmlFor="user-name">Full Name<span className="text-red-500">*</span></Label>
                        <Input
                            id="user-name"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="user-email">Email<span className="text-red-500">*</span></Label>
                        <Input
                            id="user-email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>
                    {!isViewMode && (
                        <div className="space-y-2">
                            <Label htmlFor="user-password">Password{isAddMode && <span className="text-red-500">*</span>}</Label>
                            <Input
                                id="user-password"
                                type="password"
                                placeholder={isEditMode ? "Leave blank to keep current" : "••••••••"}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="user-phone">Phone</Label>
                        <Input
                            id="user-phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={isViewMode}
                        />
                    </div>
                    <div className="pt-2">
                        <StatusSwitch
                            checked={formData.isActive}
                            onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                            label="Active Status"
                            description="Enable or disable this user account"
                            disabled={isViewMode}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
