import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
    useGetAutoResponsesQuery,
    useDeleteAutoResponseMutation,
    useBulkDeleteAutoResponsesMutation,
    AutoResponse,
} from '@/store/api/autoResponseApi';

export default function BrandOptInOutPage() {
    const navigate = useNavigate();
    const { pageSize, pageIndex, setPageSize, setPageIndex } = usePaginationState({
        defaultPageSize: 10,
        defaultPageIndex: 0,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

    // API hooks
    const { data: autoResponses = [], isLoading, isFetching } = useGetAutoResponsesQuery({
        search: searchQuery,
        page: pageIndex + 1, // Convert 0-indexed to 1-indexed
        limit: pageSize,
    });

    const [deleteAutoResponse, { isLoading: isDeleting }] = useDeleteAutoResponseMutation();
    const [bulkDeleteAutoResponses, { isLoading: isBulkDeleting }] = useBulkDeleteAutoResponsesMutation();

    // Handlers
    const handleDeleteSingle = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            await deleteAutoResponse(deleteId);
            setDeleteId(null);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length > 0) {
            await bulkDeleteAutoResponses(selectedIds);
            setSelectedIds([]);
            setShowBulkDeleteDialog(false);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(autoResponses.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        }
    };

    // Table columns
    const columns: ColumnDef<AutoResponse>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={selectedIds.length === autoResponses.length && autoResponses.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.original.id, checked as boolean)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'keyword',
            header: 'Keyword',
            cell: ({ row }) => (
                <div className="font-medium">{row.original.keyword}</div>
            ),
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => {
                const action = row.original.action;
                return (
                    <Badge variant={action === 'opt_out' ? 'destructive' : 'default'}>
                        {action === 'opt_out' ? 'Opt Out' : 'Opt In'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'reply_text',
            header: 'Reply Text',
            cell: ({ row }) => (
                <div className="max-w-md truncate text-muted-foreground">
                    {row.original.reply_text}
                </div>
            ),
        },
        {
            accessorKey: 'is_active',
            header: () => <div className="text-center">Status</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
                        {row.original.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const autoResponse = row.original;
                return (
                    <RowActions
                        onEdit={() => navigate(`/brand/opt-in-out/create/${autoResponse.id}`)}
                        onDelete={() => handleDeleteSingle(autoResponse.id)}
                    />
                );
            },
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Opt-in/Out Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage auto-responses for opt-in and opt-out keywords
                    </p>
                </div>
            </div>

            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search keywords..."
                actionButton={{
                    label: 'Add Auto Response',
                    onClick: () => navigate('/brand/opt-in-out/create'),
                    icon: <Plus className="w-4 h-4" />,
                }}
                showDelete={selectedIds.length > 0}
                deleteDisabled={selectedIds.length === 0}
                onDelete={() => setShowBulkDeleteDialog(true)}
            />

            <DataTable
                columns={columns}
                data={autoResponses}
                isLoading={isLoading}
                isFetching={isFetching}
                showPagination={true}
                pageSize={pageSize}
                initialPageIndex={pageIndex}
                onPageIndexChange={setPageIndex}
            />

            {/* Delete Single Confirmation */}
            <ConfirmationDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Auto Response"
                description="Are you sure you want to delete this auto response? This action cannot be undone."
                confirmText="Delete"
                disabled={isDeleting}
            />

            {/* Bulk Delete Confirmation */}
            <ConfirmationDialog
                open={showBulkDeleteDialog}
                onOpenChange={setShowBulkDeleteDialog}
                onConfirm={handleBulkDelete}
                title="Delete Auto Responses"
                description={`Are you sure you want to delete ${selectedIds.length} auto response(s)? This action cannot be undone.`}
                confirmText="Delete All"
                disabled={isBulkDeleting}
            />
        </div>
    );
}
