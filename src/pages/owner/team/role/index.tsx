import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { useSearch } from '@/hooks/useSearch';
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
import { useGetRolesQuery, useDeleteRoleMutation, Role } from '@/store/api/roleApi';

export default function OwnerRolePage() {
    const navigate = useNavigate();

    // Search state
    const { search, debouncedSearch, handleSearchChange, setSearch } = useSearch({
        onSearchChange: () => setPageIndex(0),
    });

    // Pagination state with URL persistence
    const { pageSize, pageIndex, setPageSize, setPageIndex } = usePaginationState({
        defaultPageSize: 10,
        defaultPageIndex: 0,
    });

    // Fetch roles from API
    const { data: rolesData = [], isLoading } = useGetRolesQuery({
        search: debouncedSearch,
    });

    // Selection state
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    const [deleteRole] = useDeleteRoleMutation();


    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteSingle = (roleId: string) => {
        setRoleToDelete(roleId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (roleToDelete) {
                await deleteRole(roleToDelete).unwrap();
                setRoleToDelete(null);
            } else {
                const ids = Object.keys(selectedRows);
                await Promise.all(ids.map(id => deleteRole(id).unwrap()));
                setSelectedRows({});
            }
            setDeleteConfirmOpen(false);
        } catch (error) {
            console.error('Failed to delete roles:', error);
        }
    };

    // Filter roles - since backend handles search, we just use rolesData
    const filteredRoles = rolesData;


    // Define columns
    const columns: ColumnDef<Role>[] = [
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
            accessorKey: "permissions",
            header: () => <div className="text-center">Permissions</div>,
            cell: ({ row }) => {
                const permissionCount = row.original.permissions?.length || 0;
                return (
                    <div className="text-center">
                        <Badge variant="outline" className="font-normal">
                            {permissionCount} permission{permissionCount !== 1 ? 's' : ''}
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
                        onEdit={() => navigate(`/owner/team/role/create/${role.id}`)}
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
