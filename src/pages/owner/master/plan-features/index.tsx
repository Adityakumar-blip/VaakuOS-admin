import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { useSearch } from '@/hooks/useSearch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Database } from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { DataTable } from '@/components/ui/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import {
    useGetMastersQuery,
    useDeleteMasterMutation,
} from '@/store/api/mastersApi';
import { type PlanFeature } from './types';

const PLAN_FEATURES_URL = '/plan-features';

export default function PlanFeaturesPage() {
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

    // Fetch plan features from API
    const { data: response, isLoading } = useGetMastersQuery({
        url: PLAN_FEATURES_URL,
        params: debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : '',
    });

    const planFeatures = useMemo(() => {
        return Array.isArray(response) ? response : (response as { data?: PlanFeature[] })?.data || [];
    }, [response]);

    // Selection state
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

    const [deleteFeature, { isLoading: isDeleting }] = useDeleteMasterMutation();



    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteSingle = (featureId: string) => {
        setFeatureToDelete(featureId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (featureToDelete) {
                await deleteFeature({ url: PLAN_FEATURES_URL, id: featureToDelete }).unwrap();
                setFeatureToDelete(null);
            } else {
                const selectedIds = Object.keys(selectedRows);
                await Promise.all(
                    selectedIds.map((id) =>
                        deleteFeature({ url: PLAN_FEATURES_URL, id }).unwrap()
                    )
                );
                setSelectedRows({});
            }
            setDeleteConfirmOpen(false);
        } catch (error) {
            console.error('Failed to delete plan features:', error);
        }
    };

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!search) return planFeatures;
        return planFeatures.filter(
            (feature) =>
                feature.name.toLowerCase().includes(search.toLowerCase()) ||
                feature.code.toLowerCase().includes(search.toLowerCase()) ||
                feature.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, planFeatures]);

    // Define columns
    const columns: ColumnDef<PlanFeature>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                                ? 'indeterminate'
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
            accessorKey: 'name',
            header: 'Feature',
            cell: ({ row }) => {
                const feature = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Database size={16} />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{feature.name}</p>
                            {feature.description && (
                                <p className="text-xs text-muted-foreground">{feature.description}</p>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => {
                return (
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                        {row.original.code}
                    </code>
                );
            },
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => {
                const type = row.getValue('type') as string;
                return (
                    <Badge variant="outline" className="capitalize font-normal">
                        {type}
                    </Badge>
                );
            },
        },
        // {
        //     accessorKey: 'is_active',
        //     header: 'Status',
        //     cell: ({ row }) => {
        //         const isActive = row.getValue('is_active') as boolean;
        //         return (
        //             <Badge variant={isActive ? 'default' : 'secondary'} className="capitalize">
        //                 {isActive ? 'Active' : 'Inactive'}
        //             </Badge>
        //         );
        //     },
        // },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const feature = row.original;
                return (
                    <RowActions
                        onEdit={() =>
                            navigate(`/owner/master/plan-features/create?id=${feature.id}&action=edit`)
                        }
                        onDelete={() => handleDeleteSingle(feature.id)}
                        onView={() =>
                            navigate(`/owner/master/plan-features/create?id=${feature.id}&action=view`)
                        }
                    />
                );
            },
        },
    ];

    const selectedIds = Object.keys(selectedRows);

    // Get delete confirmation message
    const getDeleteMessage = () => {
        if (featureToDelete) {
            const feature = planFeatures.find((f) => f.id === featureToDelete);
            return {
                title: 'Delete Plan Feature',
                description: `Are you sure you want to delete "${feature?.name}"? This action cannot be undone.`,
            };
        }
        return {
            title: 'Delete Plan Features',
            description: `Are you sure you want to delete ${selectedIds.length} selected feature${selectedIds.length > 1 ? 's' : ''
                }? This action cannot be undone.`,
        };
    };

    const deleteMessage = getDeleteMessage();

    return (
        <div className="space-y-6 pt-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Plan Features</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage plan feature configurations and settings
                    </p>
                </div>
            </div>

            {/* Table Header with Search, Entries, Delete, Add */}
            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search plan features..."
                showDelete={true}
                deleteDisabled={selectedIds.length === 0}
                onDelete={handleDeleteClick}
                actionButton={{
                    label: 'Create Plan Feature',
                    onClick: () => navigate('/owner/master/plan-features/create'),
                    icon: <Plus size={18} />,
                }}
            />

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredData}
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
                    if (!open) setFeatureToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title={deleteMessage.title}
                description={deleteMessage.description}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                isLoading={isDeleting}
            />
        </div>
    );
}
