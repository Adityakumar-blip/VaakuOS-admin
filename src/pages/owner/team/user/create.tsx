import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import { ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { 
    useAddUserMutation, 
    useUpdateUserMutation, 
    useGetUserByIdQuery 
} from '@/store/api/userApi';
import { useGetRolesQuery } from '@/store/api/roleApi';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
        role: '', // Default role
    });

    // Fetch user details if in edit/view mode
    const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(id as string, {
        skip: !id,
    });

    // Fetch available roles
    const { data: rolesResponse } = useGetRolesQuery({});
    const roles = rolesResponse?.data || [];

    const [addUser] = useAddUserMutation();
    const [updateUser] = useUpdateUserMutation();

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.name,
                email: user.email,
                password: '', // Don't show password on edit
                phone: user.phone_number || '',
                isActive: user.status === 'active',
                role: user.user_roles?.[0]?.roles?.id || '',
            });
        }
    }, [user]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            const userData = {
                name: formData.fullName,
                email: formData.email,
                roleId: formData.role,
                status: formData.isActive ? 'active' : ('inactive' as 'inactive'),
                phone_number: formData.phone,
                ...(formData.password ? { password: formData.password } : {}),
            };

            if (isAddMode) {
                await addUser(userData).unwrap();
                toast.success('User created successfully');
            } else if (isEditMode && id) {
                await updateUser({ id, data: userData }).unwrap();
                toast.success('User updated successfully');
            }
            navigate('/owner/team/user');
        } catch (error) {
            console.error(error);
            // Error toast is handled by api middleware
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
                        <Label htmlFor="user-role">Role<span className="text-red-500">*</span></Label>
                        <Select
                            disabled={isViewMode}
                            value={formData.role}
                            onValueChange={(value) => handleInputChange('role', value)}
                        >
                            <SelectTrigger id="user-role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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
