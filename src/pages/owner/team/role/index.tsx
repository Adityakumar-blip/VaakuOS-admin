import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Plus,
    Shield
} from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface RoleItem {
    id: string;
    name: string;
    description: string;
    users: number;
    isSystem: boolean;
}

const rolesData: RoleItem[] = [
    { id: '1', name: 'Super Admin', description: 'Full access to all system modules and settings', users: 2, isSystem: true },
    { id: '2', name: 'Admin', description: 'Access to most modules, cannot manage system settings', users: 5, isSystem: false },
    { id: '3', name: 'Manager', description: 'Can view and approve requests', users: 12, isSystem: false },
    { id: '4', name: 'Support Agent', description: 'Can view and respond to tickets', users: 24, isSystem: false },
    { id: '5', name: 'Viewer', description: 'Read-only access to basic data', users: 8, isSystem: false },
    { id: '6', name: 'Editor', description: 'Can create and edit content', users: 15, isSystem: false },
    { id: '7', name: 'Moderator', description: 'Can moderate user content and comments', users: 7, isSystem: false },
    { id: '8', name: 'Analyst', description: 'Can view analytics and generate reports', users: 10, isSystem: false },
];

export default function OwnerRolePage() {
    const navigate = useNavigate();

    // Search state
    const [search, setSearch] = useState('');

    // Selection state
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    // Pagination state with URL persistence
    const { pageSize, pageIndex, setPageSize, setPageIndex } = usePaginationState({
        defaultPageSize: 10,
        defaultPageIndex: 0,
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteSingle = (roleId: string) => {
        setRoleToDelete(roleId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (roleToDelete) {
            console.log('Deleting role:', roleToDelete);
            setRoleToDelete(null);
        } else {
            console.log('Deleting roles:', Object.keys(selectedRows));
            setSelectedRows({});
        }
    };

    // Filter roles based on search
    const filteredRoles = useMemo(() => {
        return rolesData.filter(
            (role) => role.name.toLowerCase().includes(search.toLowerCase()) ||
                role.description.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    // Define columns
    const columns: ColumnDef<RoleItem>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                                ? "indeterminate"
                                : false
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    disabled={row.original.isSystem}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: "Role Name",
            cell: ({ row }) => {
                const role = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Shield size={16} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{role.name}</span>
                            {role.isSystem && (
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                    SYSTEM
                                </Badge>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {
                return (
                    <p className="text-sm text-muted-foreground">{row.original.description}</p>
                );
            }
        },
        {
            accessorKey: "users",
            header: () => <div className="text-center">Users</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <Badge variant="outline" className="font-normal">
                            {row.original.users} users
                        </Badge>
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const role = row.original;
                return (
                    <RowActions
                        onEdit={() => navigate(`/owner/team/role/create?id=${role.id}&action=edit`)}
                        onDelete={!role.isSystem ? () => handleDeleteSingle(role.id) : undefined}
                    />
                );
            },
        },
    ];

    const selectedIds = Object.keys(selectedRows);

    // Get delete confirmation message
    const getDeleteMessage = () => {
        if (roleToDelete) {
            const role = rolesData.find(r => r.id === roleToDelete);
            return {
                title: 'Delete Role',
                description: `Are you sure you want to delete ${role?.name}? This action cannot be undone.`,
            };
        }
        return {
            title: 'Delete Roles',
            description: `Are you sure you want to delete ${selectedIds.length} selected role${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`,
        };
    };

    const deleteMessage = getDeleteMessage();

    return (
        <div className="space-y-6 pt-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Roles & Permissions</h1>
                </div>
            </div>

            {/* Table Header with Search, Entries, Delete, Add */}
            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search roles..."
                showDelete={true}
                deleteDisabled={selectedIds.length === 0}
                onDelete={handleDeleteClick}
                actionButton={{
                    label: 'Create Role',
                    onClick: () => navigate('/owner/team/role/create'),
                    icon: <Plus size={18} />,
                }}
            />

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredRoles}
                rowSelection={selectedRows}
                onRowSelectionChange={setSelectedRows}
                showPagination={true}
                pageSize={pageSize}
                initialPageIndex={pageIndex}
                onPageIndexChange={setPageIndex}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationDialog
                open={deleteConfirmOpen}
                onOpenChange={(open) => {
                    setDeleteConfirmOpen(open);
                    if (!open) setRoleToDelete(null);
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
