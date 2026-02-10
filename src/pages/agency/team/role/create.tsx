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
import { getPermissionGroupsByTenantType, PermissionGroup } from '@/constants/permissionGroups';
import { Permission } from '@/types/permissions.enum';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod Schema
const roleSchema = z.object({
    name: z.string().min(1, 'Role name is required'),
    description: z.string().optional(),
    permissions: z.array(z.string()).min(1, 'Please select at least one permission'),
});

type RoleFormValues = z.infer<typeof roleSchema>;

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

    // React Hook Form
    const {
        register,
        handleSubmit: handleFormSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: '',
            description: '',
            permissions: [],
        },
    });

    const selectedPermissions = watch('permissions');

    // Get permission groups for agency tenant type
    const groups = getPermissionGroupsByTenantType('agency');

    // Active tab state
    const [activeTab, setActiveTab] = useState(groups[0]?.id || '');

    // Populate form when role data is loaded (edit mode)
    useEffect(() => {
        if (role && isEditMode) {
            reset({
                name: role.name,
                description: role.description || '',
                permissions: role.permissions || [],
            });
        }
    }, [role, isEditMode, reset]);

    const handlePermissionToggle = (permission: Permission) => {
        const currentPermissions = new Set(selectedPermissions);
        if (currentPermissions.has(permission)) {
            currentPermissions.delete(permission);
        } else {
            currentPermissions.add(permission);
        }
        setValue('permissions', Array.from(currentPermissions), { shouldValidate: true });
    };

    // Helper to check if a permission is selected (for UI)
    const isPermissionSelected = (permission: string) => selectedPermissions.includes(permission);

    const handleSubmit = async (data: RoleFormValues) => {
        try {
            const roleData = {
                name: data.name,
                description: data.description || undefined,
                permissions: data.permissions,
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

            navigate('/agency/team/role');
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
                <Button onClick={() => navigate('/agency/team/role')}>Back to Roles</Button>
            </div>
        );
    }

    const isLoading = isCreating || isUpdating;
    const activeGroup = groups.find(g => g.id === activeTab);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/agency/team/role')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditMode ? 'Edit Role' : 'Create Role'}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/agency/team/role')}>
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit(handleSubmit)} disabled={isLoading}>
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
                            {...register('name')}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Role description..."
                            {...register('description')}
                            className="min-h-[38px] resize-none"
                            rows={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="h-[calc(100vh-20rem)]">
                <CardHeader className="flex-shrink-0 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Permissions</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Selected: {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''}
                            </p>
                            {errors.permissions && <p className="text-sm text-destructive mt-1">{errors.permissions.message}</p>}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pb-6 h-[calc(100%-6rem)]">
                    <div className="flex gap-6 h-full">
                        {/* Left Sidebar - Permission Categories (Scrollable) */}
                        <div className="w-64 flex-shrink-0 space-y-1 overflow-y-auto pr-2">
                            {groups.map((group: PermissionGroup) => {
                                const groupPermissions = group.permissions;
                                const selectedCount = groupPermissions.filter(p => isPermissionSelected(p)).length;
                                const isActive = activeTab === group.id;

                                return (
                                    <button
                                        key={group.id}
                                        type="button"
                                        onClick={() => setActiveTab(group.id)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-lg transition-colors",
                                            "flex items-center justify-between group",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <span className="font-medium">{group.label}</span>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            isActive
                                                ? "bg-primary-foreground/20 text-primary-foreground"
                                                : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20"
                                        )}>
                                            {selectedCount}/{groupPermissions.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Content - Permission Checkboxes (Fixed, No Scroll) */}
                        <div className="flex-1 flex flex-col h-full">
                            {activeGroup && (
                                <>
                                    <div className="flex items-start justify-between mb-4 flex-shrink-0">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Checkbox
                                                    id={`select-all-${activeGroup.id}`}
                                                    checked={activeGroup.permissions.every(p => isPermissionSelected(p))}
                                                    onCheckedChange={() => {
                                                        const newPermissions = new Set(selectedPermissions);
                                                        const allSelected = activeGroup.permissions.every(p => isPermissionSelected(p));

                                                        activeGroup.permissions.forEach(permission => {
                                                            if (allSelected) {
                                                                newPermissions.delete(permission);
                                                            } else {
                                                                newPermissions.add(permission);
                                                            }
                                                        });
                                                        setValue('permissions', Array.from(newPermissions), { shouldValidate: true });
                                                    }}
                                                />
                                                <Label htmlFor={`select-all-${activeGroup.id}`} className="text-lg font-semibold cursor-pointer">
                                                    {activeGroup.label}
                                                </Label>
                                            </div>
                                            <p className="text-sm text-muted-foreground ml-9">{activeGroup.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
                                        {activeGroup.permissions.map((permission) => (
                                            <div key={permission} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <Checkbox
                                                    id={permission}
                                                    checked={isPermissionSelected(permission)}
                                                    onCheckedChange={() => handlePermissionToggle(permission)}
                                                />
                                                <Label
                                                    htmlFor={permission}
                                                    className="text-sm cursor-pointer font-normal flex-1"
                                                >
                                                    {permission.split(':')[1]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
