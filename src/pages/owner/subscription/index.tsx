import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { useSearch } from '@/hooks/useSearch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    useGetMastersQuery,
    useDeleteMasterMutation,
    usePublishMasterMutation,
} from '@/store/api/mastersApi';

import {
    Plus,
    CreditCard,
    Plug,
    Globe
} from 'lucide-react';

const SUBSCRIPTIONS_URL = '/subscriptions/plans';
const ADDONS_URL = '/subscriptions/addons';

interface Subscription {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    amount: number;
    is_yearly: boolean;
    yearly_discount?: number;
    is_published?: boolean;
    features: Record<string, string | number | boolean>;
}

interface Addon {
    id: string;
    name: string;
    description: string;
    amount: number;
    type: 'recurring' | 'one_time';
    is_active: boolean;
}

type TabType = 'plans' | 'addons';

export default function SubscriptionPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const initialTab = (tabParam === 'addons' ? 'addons' : 'plans') as TabType;
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    // Search state
    const { search, debouncedSearch, handleSearchChange, setSearch } = useSearch({
        onSearchChange: () => setPageIndex(0),
    });

    // Pagination state with URL persistence
    const { pageSize, pageIndex, setPageSize, setPageIndex } = usePaginationState({
        defaultPageSize: 10,
        defaultPageIndex: 0,
    });

    // Determine current API URL
    const currentUrl = activeTab === 'plans' ? SUBSCRIPTIONS_URL : ADDONS_URL;

    // Fetch data from API
    const { data: response, isLoading } = useGetMastersQuery({
        url: currentUrl,
        params: debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : '',
    });

    const data = useMemo(() => {
        return Array.isArray(response) ? response : (response as { data?: (Subscription | Addon)[] })?.data || [];
    }, [response]);

    // Selection state
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const [deleteMaster, { isLoading: isDeleting }] = useDeleteMasterMutation();

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setSearch('');
        setPageIndex(0);
        setSelectedRows({});
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('tab', tab);
            return newParams;
        });
    };

    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteSingle = (id: string) => {
        setItemToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (itemToDelete) {
                await deleteMaster({ url: currentUrl, id: itemToDelete }).unwrap();
                setItemToDelete(null);
            } else {
                const selectedIds = Object.keys(selectedRows);
                await Promise.all(
                    selectedIds.map((id) =>
                        deleteMaster({ url: currentUrl, id }).unwrap()
                    )
                );
                setSelectedRows({});
            }
            setDeleteConfirmOpen(false);
        } catch (error) {
            console.error('Failed to delete items:', error);
        }
    };

    // Publish state
    const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
    const [planToPublish, setPlanToPublish] = useState<string | null>(null);
    const [publishMaster, { isLoading: isPublishing }] = usePublishMasterMutation();

    const handlePublishClick = (id: string) => {
        setPlanToPublish(id);
        setPublishConfirmOpen(true);
    };

    const handleConfirmPublish = async () => {
        if (!planToPublish) return;
        try {
            await publishMaster({ url: SUBSCRIPTIONS_URL, id: planToPublish }).unwrap();
            setPublishConfirmOpen(false);
            setPlanToPublish(null);
        } catch (error) {
            console.error('Failed to publish plan:', error);
        }
    };

    // Filter data based on search (client-side fallback if needed, though API likely handles it)
    const filteredData = useMemo(() => {
        if (!search) return data;
        return data.filter(
            (item: Subscription | Addon) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                ('subtitle' in item && item.subtitle.toLowerCase().includes(search.toLowerCase())) ||
                (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
        );
    }, [search, data]);

    // Columns for Subscriptions
    const planColumns: ColumnDef<Subscription>[] = [
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
            header: "Plan Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <CreditCard size={16} />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">{row.original.name}</p>
                        <p className="text-xs text-muted-foreground">{row.original.subtitle}</p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "amount",
            header: "Price",
            cell: ({ row }) => (
                <span className="font-medium">
                    {(row.original.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
            )
        },
        {
            accessorKey: "type",
            header: "Billing Type",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1 items-start">
                    <Badge variant="outline">Monthly</Badge>
                    {row.original.is_yearly && (
                        <Badge variant="secondary" className="whitespace-nowrap">
                            Yearly {row.original.yearly_discount ? `(-${row.original.yearly_discount}%)` : ''}
                        </Badge>
                    )}
                </div>
            )
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <p className="text-sm text-muted-foreground max-w-xs truncate">{row.original.description}</p>
            )
        },
        {
            accessorKey: "is_published",
            header: "Publication",
            cell: ({ row }) => {
                const isPublished = row.original.is_published;
                return (
                    <div>
                        {isPublished ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                <Globe size={12} className="mr-1" />
                                Published
                            </Badge>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handlePublishClick(row.original.id)}
                            >
                                Publish
                            </Button>
                        )}
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <RowActions
                    onEdit={() => navigate(`/owner/subscription/create?id=${row.original.id}&action=edit`)}
                    onDelete={() => handleDeleteSingle(row.original.id)}
                    onView={() => navigate(`/owner/subscription/create?id=${row.original.id}&action=view`)}
                />
            ),
        },
    ];

    // Columns for Add-ons
    const addonColumns: ColumnDef<Addon>[] = [
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
            header: "Add-on Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Plug size={16} />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">{row.original.name}</p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "amount",
            header: "Price",
            cell: ({ row }) => (
                <span className="font-medium">
                    {(row.original.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    <span className="text-xs text-muted-foreground ml-1">
                        {row.original.type === 'recurring' ? '/mo' : ''}
                    </span>
                </span>
            )
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <Badge variant={row.original.type === 'recurring' ? 'default' : 'secondary'} className="capitalize">
                    {row.original.type?.replace('_', ' ')}
                </Badge>
            )
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.is_active ? 'success' : 'destructive'}>
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <RowActions
                    onEdit={() => navigate(`/owner/subscription/addons/create?id=${row.original.id}&action=edit`)}
                    onDelete={() => handleDeleteSingle(row.original.id)}
                    onView={() => navigate(`/owner/subscription/addons/create?id=${row.original.id}&action=view`)}
                />
            ),
        },
    ];

    const selectedIds = Object.keys(selectedRows);

    // Get delete confirmation message
    const getDeleteMessage = () => {
        const itemType = activeTab === 'plans' ? 'Subscription' : 'Add-on';
        if (itemToDelete) {
            const item = data.find((d: Subscription | Addon) => d.id === itemToDelete);
            return {
                title: `Delete ${itemType}`,
                description: `Are you sure you want to delete "${item?.name}"? This action cannot be undone.`,
            };
        }
        return {
            title: `Delete ${itemType}s`,
            description: `Are you sure you want to delete ${selectedIds.length} selected ${itemType.toLowerCase()}${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`,
        };
    };

    const deleteMessage = getDeleteMessage();

    return (
        <div className="space-y-6 pt-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Subscriptions & Add-ons</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage subscription plans and additional services
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <div className="flex gap-4">
                    <button
                        onClick={() => handleTabChange('plans')}
                        className={cn(
                            "px-4 py-2 border-b-2 text-sm font-medium transition-colors",
                            activeTab === 'plans'
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Plans
                    </button>
                    <button
                        onClick={() => handleTabChange('addons')}
                        className={cn(
                            "px-4 py-2 border-b-2 text-sm font-medium transition-colors",
                            activeTab === 'addons'
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Add-ons
                    </button>
                </div>
            </div>

            {/* Table Header with Search, Entries, Delete, Add */}
            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder={`Search ${activeTab === 'plans' ? 'plans' : 'add-ons'}...`}
                showDelete={true}
                deleteDisabled={selectedIds.length === 0}
                onDelete={handleDeleteClick}
                actionButton={{
                    label: `Create ${activeTab === 'plans' ? 'Plan' : 'Add-on'}`,
                    onClick: () => navigate(activeTab === 'plans' ? '/owner/subscription/create' : '/owner/subscription/addons/create'),
                    icon: <Plus size={18} />,
                }}
            />

            {/* Data Table */}
            <DataTable
                columns={activeTab === 'plans' ? planColumns : addonColumns}
                data={filteredData}
                rowSelection={selectedRows}
                onRowSelectionChange={setSelectedRows}
                showPagination={true}
                pageSize={pageSize}
                initialPageIndex={pageIndex}
                onPageIndexChange={setPageIndex}
                isLoading={isLoading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationDialog
                open={deleteConfirmOpen}
                onOpenChange={(open) => {
                    setDeleteConfirmOpen(open);
                    if (!open) setItemToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title={deleteMessage.title}
                description={deleteMessage.description}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                isLoading={isDeleting}
            />

            {/* Publish Confirmation Modal */}
            <ConfirmationDialog
                open={publishConfirmOpen}
                onOpenChange={(open) => {
                    setPublishConfirmOpen(open);
                    if (!open) setPlanToPublish(null);
                }}
                onConfirm={handleConfirmPublish}
                title="Publish Plan"
                description="Are you sure you want to publish this plan? This will make it available on external platforms (e.g. App Store, Razorpay)."
                confirmText="Publish"
                cancelText="Cancel"
                isLoading={isPublishing}
            />
        </div>
    );
}
