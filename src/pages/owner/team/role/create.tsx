import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetRoleByIdQuery, useAddRoleMutation, useUpdateRoleMutation } from '@/store/api/roleApi';
import { getPermissionGroupsByTenantType } from '@/constants/permissionGroups';
import { Permission } from '@/types/permissions.enum';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function OwnerRoleFormPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();

    // Determine if we're in edit mode based on presence of ID
    const isEditMode = Boolean(id);

    // Fetch role data if editing
    const { data: role, isLoading: isLoadingRole } = useGetRoleByIdQuery(id || '', {
        skip: !isEditMode,
    });

    const [addRole, { isLoading: isCreating }] = useAddRoleMutation();
    const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

    // Get permission groups for owner tenant type
    const groups = getPermissionGroupsByTenantType('owner');

    // Populate form when role data is loaded (edit mode)
    useEffect(() => {
        if (role && isEditMode) {
            setRoleName(role.name);
            setDescription(role.description || '');
            setSelectedPermissions(new Set(role.permissions || []));
        }
    }, [role, isEditMode]);

    const handlePermissionToggle = (permission: Permission) => {
        const newPermissions = new Set(selectedPermissions);
        if (newPermissions.has(permission)) {
            newPermissions.delete(permission);
        } else {
            newPermissions.add(permission);
        }
        setSelectedPermissions(newPermissions);
    };

    const handleGroupToggle = (groupPermissions: Permission[], allSelected: boolean) => {
        const newPermissions = new Set(selectedPermissions);
        groupPermissions.forEach(permission => {
            if (allSelected) {
                newPermissions.delete(permission);
            } else {
                newPermissions.add(permission);
            }
        });
        setSelectedPermissions(newPermissions);
    };

    const handleSelectAll = () => {
        const allPermissions = new Set<string>();
        groups.forEach(group => {
            group.permissions.forEach(permission => {
                allPermissions.add(permission);
            });
        });
        setSelectedPermissions(allPermissions);
    };

    const handleDeselectAll = () => {
        setSelectedPermissions(new Set());
    };

    const handleSubmit = async () => {
        // Validation
        if (!roleName.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Role name is required',
                variant: 'destructive',
            });
            return;
        }

        if (selectedPermissions.size === 0) {
            toast({
                title: 'Validation Error',
                description: 'Please select at least one permission',
                variant: 'destructive',
            });
            return;
        }

        try {
            const roleData = {
                name: roleName,
                description: description || undefined,
                permissions: Array.from(selectedPermissions),
            };

            if (isEditMode && id) {
                await updateRole({ id, data: roleData }).unwrap();
                toast({
                    title: 'Success',
                    description: 'Role updated successfully',
                });
            } else {
                await addRole(roleData).unwrap();
                toast({
                    title: 'Success',
                    description: 'Role created successfully',
                });
            }

            navigate('/owner/team/role');
        } catch (error) {
            console.error('Failed to save role:', error);
            toast({
                title: 'Error',
                description: `Failed to ${isEditMode ? 'update' : 'create'} role. Please try again.`,
                variant: 'destructive',
            });
        }
    };

    // Loading state for edit mode
    if (isEditMode && isLoadingRole) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Not found state for edit mode
    if (isEditMode && !role && !isLoadingRole) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
                <p className="text-muted-foreground">Role not found</p>
                <Button onClick={() => navigate('/owner/team/role')}>Back to Roles</Button>
            </div>
        );
    }

    const isLoading = isCreating || isUpdating;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/owner/team/role')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditMode ? 'Edit Role' : 'Create Role'}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/owner/team/role')}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? 'Save Changes' : 'Create Role'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Role name"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Role description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[38px] resize-none"
                            rows={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Permissions</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleSelectAll}>
                                Select All
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                                Deselect All
                            </Button>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Selected: {selectedPermissions.size} permission{selectedPermissions.size !== 1 ? 's' : ''}
                    </p>
                </CardHeader>
                <CardContent className="pb-6">
                    <div className="space-y-6">
                        {groups.map((group) => {
                            const groupPermissions = group.permissions;
                            const selectedCount = groupPermissions.filter(p => selectedPermissions.has(p)).length;
                            const allSelected = selectedCount === groupPermissions.length;
                            const someSelected = selectedCount > 0 && selectedCount < groupPermissions.length;

                            return (
                                <div key={group.id} className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`group-${group.id}`}
                                                    checked={allSelected}
                                                    ref={(el) => {
                                                        if (el) {
                                                            const input = el.querySelector('input');
                                                            if (input) {
                                                                input.indeterminate = someSelected;
                                                            }
                                                        }
                                                    }}
                                                    onCheckedChange={() => handleGroupToggle(groupPermissions, allSelected)}
                                                />
                                                <Label
                                                    htmlFor={`group-${group.id}`}
                                                    className="text-base font-semibold cursor-pointer"
                                                >
                                                    {group.label}
                                                </Label>
                                                <span className="text-xs text-muted-foreground">
                                                    ({selectedCount}/{groupPermissions.length})
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground ml-6">{group.description}</p>
                                        </div>
                                    </div>

                                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {groupPermissions.map((permission) => (
                                            <div key={permission} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={permission}
                                                    checked={selectedPermissions.has(permission)}
                                                    onCheckedChange={() => handlePermissionToggle(permission)}
                                                />
                                                <Label
                                                    htmlFor={permission}
                                                    className="text-sm cursor-pointer font-normal"
                                                >
                                                    {permission.split(':')[1]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
