import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Ticket } from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface Coupon {
    id: string;
    code: string;
    plan: string;
    maxUsers: number;
    usedCount: number;
    status: 'active' | 'inactive' | 'expired';
}

// Mock data
const couponsData: Coupon[] = [
    {
        id: '1',
        code: 'PREMIUM2024',
        plan: 'Premium Plan',
        maxUsers: 100,
        usedCount: 45,
        status: 'active'
    },
    {
        id: '2',
        code: 'BASIC50OFF',
        plan: 'Basic Plan',
        maxUsers: 50,
        usedCount: 50,
        status: 'expired'
    },
];

export default function CouponPage() {
    const navigate = useNavigate();

    // Search state
    const [search, setSearch] = useState('');

    // Selection state
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

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

    const handleDeleteSingle = (couponId: string) => {
        setCouponToDelete(couponId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (couponToDelete) {
            console.log('Deleting coupon:', couponToDelete);
            setCouponToDelete(null);
        } else {
            console.log('Deleting coupons:', Object.keys(selectedRows));
            setSelectedRows({});
        }
        setDeleteConfirmOpen(false);
    };

    // Filter coupons based on search
    const filteredCoupons = useMemo(() => {
        return couponsData.filter(
            (coupon) => coupon.code.toLowerCase().includes(search.toLowerCase()) ||
                coupon.plan.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    // Define columns
    const columns: ColumnDef<Coupon>[] = [
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
            accessorKey: "code",
            header: "Coupon Code",
            cell: ({ row }) => {
                const coupon = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Ticket size={16} />
                        </div>
                        <span className="font-medium font-mono">{coupon.code}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "plan",
            header: "Plan",
            cell: ({ row }) => {
                return (
                    <Badge variant="outline" className="font-normal">
                        {row.original.plan}
                    </Badge>
                );
            }
        },
        {
            accessorKey: "usage",
            header: "Usage",
            cell: ({ row }) => {
                const coupon = row.original;
                const percentage = (coupon.usedCount / coupon.maxUsers) * 100;
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                            <span>{coupon.usedCount} / {coupon.maxUsers}</span>
                            <span className="text-muted-foreground">({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                                className="bg-primary h-1.5 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const variant = status === 'active' ? 'default' : status === 'expired' ? 'destructive' : 'secondary';
                return (
                    <Badge variant={variant} className="capitalize">
                        {status}
                    </Badge>
                );
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const coupon = row.original;
                return (
                    <RowActions
                        onEdit={() => navigate(`/owner/coupon/create?id=${coupon.id}&action=edit`)}
                        onDelete={() => handleDeleteSingle(coupon.id)}
                        onView={() => navigate(`/owner/coupon/create?id=${coupon.id}&action=view`)}
                    />
                );
            },
        },
    ];

    const selectedIds = Object.keys(selectedRows);

    // Get delete confirmation message
    const getDeleteMessage = () => {
        if (couponToDelete) {
            const coupon = couponsData.find(c => c.id === couponToDelete);
            return {
                title: 'Delete Coupon',
                description: `Are you sure you want to delete coupon ${coupon?.code}? This action cannot be undone.`,
            };
        }
        return {
            title: 'Delete Coupons',
            description: `Are you sure you want to delete ${selectedIds.length} selected coupon${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`,
        };
    };

    const deleteMessage = getDeleteMessage();

    return (
        <div className="space-y-6 pt-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Coupon Management</h1>
                </div>
            </div>

            {/* Table Header with Search, Entries, Delete, Add */}
            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search coupons..."
                showDelete={true}
                deleteDisabled={selectedIds.length === 0}
                onDelete={handleDeleteClick}
                actionButton={{
                    label: 'Create Coupon',
                    onClick: () => navigate('/owner/coupon/create'),
                    icon: <Plus size={18} />,
                }}
            />

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredCoupons}
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
                    if (!open) setCouponToDelete(null);
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
