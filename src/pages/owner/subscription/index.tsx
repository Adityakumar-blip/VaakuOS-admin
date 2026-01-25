import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar } from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface Subscription {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive';
}

// Mock data
const subscriptionsData: Subscription[] = [
    {
        id: '1',
        title: 'Premium Plan',
        subtitle: 'Best value for businesses',
        description: 'Full access to all features',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active'
    },
    {
        id: '2',
        title: 'Basic Plan',
        subtitle: 'Perfect for startups',
        description: 'Essential features included',
        startDate: '2024-02-01',
        endDate: '2024-12-31',
        status: 'active'
    },
];

export default function SubscriptionPage() {
    const navigate = useNavigate();

    // Search state
    const [search, setSearch] = useState('');

    // Selection state
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);

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

    const handleDeleteSingle = (subscriptionId: string) => {
        setSubscriptionToDelete(subscriptionId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (subscriptionToDelete) {
            console.log('Deleting subscription:', subscriptionToDelete);
            setSubscriptionToDelete(null);
        } else {
            console.log('Deleting subscriptions:', Object.keys(selectedRows));
            setSelectedRows({});
        }
        setDeleteConfirmOpen(false);
    };

    // Filter subscriptions based on search
    const filteredSubscriptions = useMemo(() => {
        return subscriptionsData.filter(
            (sub) => sub.title.toLowerCase().includes(search.toLowerCase()) ||
                sub.subtitle.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    // Define columns
    const columns: ColumnDef<Subscription>[] = [
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
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => {
                const subscription = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{subscription.title}</p>
                            <p className="text-xs text-muted-foreground">{subscription.subtitle}</p>
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
                    <p className="text-sm text-muted-foreground max-w-xs truncate">{row.original.description}</p>
                );
            }
        },
        {
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({ row }) => {
                return (
                    <span className="text-sm">{new Date(row.original.startDate).toLocaleDateString()}</span>
                );
            }
        },
        {
            accessorKey: "endDate",
            header: "End Date",
            cell: ({ row }) => {
                return (
                    <span className="text-sm">{new Date(row.original.endDate).toLocaleDateString()}</span>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge variant={status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {status}
                    </Badge>
                );
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const subscription = row.original;
                return (
                    <RowActions
                        onEdit={() => navigate(`/owner/subscription/create?id=${subscription.id}&action=edit`)}
                        onDelete={() => handleDeleteSingle(subscription.id)}
                        onView={() => navigate(`/owner/subscription/create?id=${subscription.id}&action=view`)}
                    />
                );
            },
        },
    ];

    const selectedIds = Object.keys(selectedRows);

    // Get delete confirmation message
    const getDeleteMessage = () => {
        if (subscriptionToDelete) {
            const subscription = subscriptionsData.find(s => s.id === subscriptionToDelete);
            return {
                title: 'Delete Subscription',
                description: `Are you sure you want to delete ${subscription?.title}? This action cannot be undone.`,
            };
        }
        return {
            title: 'Delete Subscriptions',
            description: `Are you sure you want to delete ${selectedIds.length} selected subscription${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`,
        };
    };

    const deleteMessage = getDeleteMessage();

    return (
        <div className="space-y-6 pt-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Subscription Management</h1>
                </div>
            </div>

            {/* Table Header with Search, Entries, Delete, Add */}
            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search subscriptions..."
                showDelete={true}
                deleteDisabled={selectedIds.length === 0}
                onDelete={handleDeleteClick}
                actionButton={{
                    label: 'Create Subscription',
                    onClick: () => navigate('/owner/subscription/create'),
                    icon: <Plus size={18} />,
                }}
            />

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredSubscriptions}
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
                    if (!open) setSubscriptionToDelete(null);
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
