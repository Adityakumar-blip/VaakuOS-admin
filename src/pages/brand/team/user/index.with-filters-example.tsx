/**
 * Example: User Page with Persisted Filters
 * 
 * This example shows how to use the usePersistedFilters hook
 * to handle large filter sets (25-30 fields with 700+ options)
 * while avoiding URL length limits.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, CheckCircle2, XCircle, RefreshCw, Trash2, Filter, X } from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { userService, type User } from '@/services/userService';
import { DataTable, BulkAction } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { usePersistedFilters, type FilterState } from '@/hooks/usePersistedFilters';

// Define your filter structure
interface UserFilters extends FilterState {
    status: string[];
    role: string[];
    department: string[];
    location: string[];
    skills: string[];
    experience: string[];
    // ... add all your 25-30 filter fields here
    search: string;
    dateRange: { from?: Date; to?: Date } | null;
}

export default function UserPageWithFilters() {
    const navigate = useNavigate();

    // Use persisted filters hook
    const {
        filters,
        updateFilters,
        clearFilters,
        hasActiveFilters,
        activeFilterCount,
        isLoading,
    } = usePersistedFilters<UserFilters>({
        storageKey: 'user-page-filters',
        defaultFilters: {
            status: [],
            role: [],
            department: [],
            location: [],
            skills: [],
            experience: [],
            search: '',
            dateRange: null,
        },
        useUrlHash: true, // Use short hash in URL
    });

    // Users state
    const [users, setUsers] = useState<User[]>(() => userService.getUsers());
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    // Update individual filter
    const handleFilterChange = <K extends keyof UserFilters>(key: K, value: UserFilters[K]) => {
        updateFilters({ [key]: value });
    };

    // Update search
    const handleSearchChange = (value: string) => {
        updateFilters({ search: value });
    };

    // Apply filters to data
    const filteredData = useMemo(() => {
        if (isLoading) return [];

        let result = users;

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (filters.status.length > 0) {
            result = result.filter(user => filters.status.includes(user.status));
        }

        // Role filter
        if (filters.role.length > 0) {
            result = result.filter(user => filters.role.includes(user.role));
        }

        // Add more filter logic for your 25-30 fields...
        // if (filters.department.length > 0) { ... }
        // if (filters.location.length > 0) { ... }
        // etc.

        return result;
    }, [users, filters, isLoading]);

    const handleDeleteSingle = (userId: string) => {
        setUserToDelete(userId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            userService.deleteUser(userToDelete);
            setUserToDelete(null);
        } else {
            const selectedIds = Object.keys(selectedRows);
            userService.deleteUsers(selectedIds);
            setSelectedRows({});
        }
        setUsers(userService.getUsers());
        setDeleteConfirmOpen(false);
    };

    // Define columns
    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: "User",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <Badge variant="outline" className="capitalize font-normal">
                    {row.getValue("role") as string}
                </Badge>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <div className="flex items-center gap-2">
                        {status === 'active' ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                            <XCircle size={16} className="text-muted-foreground" />
                        )}
                        <span className={`text-sm ${status === 'active' ? 'text-green-600' : 'text-muted-foreground'} capitalize`}>
                            {status}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <RowActions
                        onEdit={() => navigate(`/brand/team/user/create?id=${user.id}&action=edit`)}
                        onDelete={() => handleDeleteSingle(user.id)}
                        onView={() => navigate(`/brand/team/user/create?id=${user.id}&action=view`)}
                    />
                );
            },
        },
    ];

    const deleteMessage = {
        title: userToDelete ? 'Delete User' : 'Delete Users',
        description: userToDelete
            ? `Are you sure you want to delete this user?`
            : `Are you sure you want to delete ${Object.keys(selectedRows).length} selected users?`,
    };

    const bulkActions: BulkAction<User>[] = [
        {
            label: "Delete Selected",
            icon: <Trash2 size={16} />,
            onClick: () => setDeleteConfirmOpen(true),
            variant: "destructive",
        },
    ];

    if (isLoading) {
        return <div className="flex items-center justify-center p-12">Loading filters...</div>;
    }

    return (
        <div className="space-y-6 pt-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {hasActiveFilters && (
                            <span className="inline-flex items-center gap-2">
                                <Filter size={14} />
                                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                            </span>
                        )}
                    </p>
                </div>
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                        <X size={16} className="mr-2" />
                        Clear All Filters
                    </Button>
                )}
            </div>

            {/* Filter Panel - Example with Status and Role */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center gap-2">
                        <Filter size={16} />
                        Filters
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <div className="space-y-2">
                            {['active', 'inactive'].map(status => (
                                <label key={status} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        checked={filters.status.includes(status)}
                                        onCheckedChange={(checked) => {
                                            const newStatus = checked
                                                ? [...filters.status, status]
                                                : filters.status.filter(s => s !== status);
                                            handleFilterChange('status', newStatus);
                                        }}
                                    />
                                    <span className="text-sm capitalize">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Role</label>
                        <div className="space-y-2">
                            {['admin', 'user', 'manager'].map(role => (
                                <label key={role} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        checked={filters.role.includes(role)}
                                        onCheckedChange={(checked) => {
                                            const newRole = checked
                                                ? [...filters.role, role]
                                                : filters.role.filter(r => r !== role);
                                            handleFilterChange('role', newRole);
                                        }}
                                    />
                                    <span className="text-sm capitalize">{role}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Add more filter fields here for your 25-30 fields */}
                    {/* Department, Location, Skills, Experience, etc. */}
                </div>
            </div>

            {/* Table Header */}
            <TableHeaderComponent
                entriesPerPage={10}
                onEntriesChange={() => { }}
                searchValue={filters.search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search users..."
                showDelete={true}
                deleteDisabled={Object.keys(selectedRows).length === 0}
                onDelete={() => setDeleteConfirmOpen(true)}
                actionButton={{
                    label: 'Add User',
                    onClick: () => navigate('/brand/team/user/create'),
                    icon: <Plus size={18} />,
                }}
            />

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredData}
                rowSelection={selectedRows}
                onRowSelectionChange={setSelectedRows}
                bulkActions={bulkActions}
                showPagination={true}
                pageSize={10}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationDialog
                open={deleteConfirmOpen}
                onOpenChange={(open) => {
                    setDeleteConfirmOpen(open);
                    if (!open) setUserToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title={deleteMessage.title}
                description={deleteMessage.description}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
