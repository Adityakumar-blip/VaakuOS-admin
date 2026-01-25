import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Plus,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { userService, type User } from '@/services/userService';
import { DataTable, BulkAction } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function OwnerUserPage() {
    const navigate = useNavigate();

    // Users state
    const [users, setUsers] = useState<User[]>(() => userService.getUsers());

    // Search state
    const [search, setSearch] = useState('');

    // Selection state
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    // Bulk status change state
    const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
    const [usersToChangeStatus, setUsersToChangeStatus] = useState<User[]>([]);
    const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active');

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

    const handleBulkDelete = (selectedUsers: User[]) => {
        setUserToDelete(null); // Indicates bulk mode
        setDeleteConfirmOpen(true);
    };

    const handleBulkStatusChange = (selectedUsers: User[]) => {
        setUsersToChangeStatus(selectedUsers);
        // Default to opposite of first user's status
        setNewStatus(selectedUsers[0]?.status === 'active' ? 'inactive' : 'active');
        setStatusChangeDialogOpen(true);
    };

    const handleConfirmStatusChange = () => {
        usersToChangeStatus.forEach(user => {
            userService.updateUser(user.id, { status: newStatus });
        });
        setUsers(userService.getUsers());
        setStatusChangeDialogOpen(false);
        setUsersToChangeStatus([]);
        setSelectedRows({});
    };

    // Define columns
    const columns: ColumnDef<User>[] = [
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
            cell: ({ row }) => {
                const role = row.getValue("role") as string;
                return (
                    <Badge variant="outline" className="capitalize font-normal">
                        {role}
                    </Badge>
                );
            }
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
                        onEdit={() => navigate(`/owner/team/user/create?id=${user.id}&action=edit`)}
                        onDelete={() => handleDeleteSingle(user.id)}
                        onView={() => navigate(`/owner/team/user/create?id=${user.id}&action=view`)}
                    />
                );
            },
        },
    ];

    // Filter data for search
    const filteredData = useMemo(() => {
        if (!search) return users;
        return users.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    const getDeleteMessage = () => {
        if (userToDelete) {
            const user = users.find(u => u.id === userToDelete);
            return {
                title: 'Delete User',
                description: `Are you sure you want to delete ${user?.name}? This action cannot be undone.`,
            };
        }
        const selectedCount = Object.keys(selectedRows).length;
        return {
            title: 'Delete Users',
            description: `Are you sure you want to delete ${selectedCount} selected user${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`,
        };
    };

    const deleteMessage = getDeleteMessage();
    const selectedIds = Object.keys(selectedRows);

    // Bulk actions configuration
    const bulkActions: BulkAction<User>[] = [
        {
            label: "Change Status",
            icon: <RefreshCw size={16} />,
            onClick: handleBulkStatusChange,
            variant: "default",
        },
        {
            label: "Delete Selected",
            icon: <Trash2 size={16} />,
            onClick: handleBulkDelete,
            variant: "destructive",
        },
    ];

    return (
        <div className="space-y-6 pt-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
                </div>
            </div>

            {/* Table Header with Search, Entries, Delete, Add */}
            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search users..."
                showDelete={true}
                deleteDisabled={selectedIds.length === 0}
                onDelete={handleDeleteClick}
                actionButton={{
                    label: 'Add User',
                    onClick: () => navigate('/owner/team/user/create'),
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
                pageSize={pageSize}
                initialPageIndex={pageIndex}
                onPageIndexChange={setPageIndex}
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

            {/* Status Change Dialog */}
            <Dialog open={statusChangeDialogOpen} onOpenChange={setStatusChangeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Status</DialogTitle>
                        <DialogDescription>
                            Change the status of {usersToChangeStatus.length} selected user{usersToChangeStatus.length > 1 ? 's' : ''}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 py-4">
                        <Button
                            variant={newStatus === 'active' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => setNewStatus('active')}
                        >
                            <CheckCircle2 size={16} className="mr-2" />
                            Active
                        </Button>
                        <Button
                            variant={newStatus === 'inactive' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => setNewStatus('inactive')}
                        >
                            <XCircle size={16} className="mr-2" />
                            Inactive
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusChangeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmStatusChange}>
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
