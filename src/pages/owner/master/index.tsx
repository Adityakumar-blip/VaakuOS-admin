import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaginationState } from '@/hooks/usePaginationState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Database } from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface MasterItem {
    id: string;
    name: string;
    value: string;
    description?: string;
    status: 'active' | 'inactive';
    order: number;
}

// Mock data for different master types
const featuresMasterData: MasterItem[] = [
    { id: '1', name: 'WhatsApp Integration', value: 'whatsapp', description: 'WhatsApp messaging feature', status: 'active', order: 1 },
    { id: '2', name: 'Analytics Dashboard', value: 'analytics', description: 'Advanced analytics', status: 'active', order: 2 },
];

const faqCategoriesData: MasterItem[] = [
    { id: '1', name: 'General', value: 'general', status: 'active', order: 1 },
    { id: '2', name: 'Subscriptions', value: 'subscriptions', status: 'active', order: 2 },
    { id: '3', name: 'Technical', value: 'technical', status: 'active', order: 3 },
];

const plansMasterData: MasterItem[] = [
    { id: '1', name: 'Basic Plan', value: 'basic', description: 'Entry level plan', status: 'active', order: 1 },
    { id: '2', name: 'Premium Plan', value: 'premium', description: 'Full featured plan', status: 'active', order: 2 },
];

const integrationsMasterData: MasterItem[] = [
    { id: '1', name: 'Stripe', value: 'stripe', description: 'Payment gateway', status: 'active', order: 1 },
    { id: '2', name: 'Twilio', value: 'twilio', description: 'SMS service', status: 'active', order: 2 },
];

type MasterType = 'features' | 'faq-categories' | 'plans' | 'integrations';

const masterDataMap: Record<MasterType, MasterItem[]> = {
    'features': featuresMasterData,
    'faq-categories': faqCategoriesData,
    'plans': plansMasterData,
    'integrations': integrationsMasterData,
};

const masterLabels: Record<MasterType, string> = {
    'features': 'Features',
    'faq-categories': 'FAQ Categories',
    'plans': 'Plans',
    'integrations': 'Integrations',
};

export default function MasterDataPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<MasterType>('features');

    // Search state
    const [search, setSearch] = useState('');

    // Selection state
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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

    const handleDeleteSingle = (itemId: string) => {
        setItemToDelete(itemId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            console.log('Deleting item:', itemToDelete);
            setItemToDelete(null);
        } else {
            console.log('Deleting items:', Object.keys(selectedRows));
            setSelectedRows({});
        }
        setDeleteConfirmOpen(false);
    };

    // Get current master data
    const currentData = masterDataMap[activeTab];

    // Filter data based on search
    const filteredData = useMemo(() => {
        return currentData.filter(
            (item) => item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.value.toLowerCase().includes(search.toLowerCase()) ||
                item.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, currentData]);

    // Define columns
    const columns: ColumnDef<MasterItem>[] = [
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
            accessorKey: "order",
            header: "Order",
            cell: ({ row }) => {
                return (
                    <span className="text-sm font-medium">{row.original.order}</span>
                );
            }
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Database size={16} />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            {item.description && (
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "value",
            header: "Value",
            cell: ({ row }) => {
                return (
                    <code className="text-sm bg-muted px-2 py-1 rounded">{row.original.value}</code>
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
                const item = row.original;
                return (
                    <RowActions
                        onEdit={() => navigate(`/owner/master/create?type=${activeTab}&id=${item.id}&action=edit`)}
                        onDelete={() => handleDeleteSingle(item.id)}
                        onView={() => navigate(`/owner/master/create?type=${activeTab}&id=${item.id}&action=view`)}
                    />
                );
            },
        },
    ];

    const selectedIds = Object.keys(selectedRows);

    // Get delete confirmation message
    const getDeleteMessage = () => {
        if (itemToDelete) {
            const item = currentData.find(i => i.id === itemToDelete);
            return {
                title: 'Delete Item',
                description: `Are you sure you want to delete "${item?.name}"? This action cannot be undone.`,
            };
        }
        return {
            title: 'Delete Items',
            description: `Are you sure you want to delete ${selectedIds.length} selected item${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`,
        };
    };

    const deleteMessage = getDeleteMessage();

    return (
        <div className="space-y-6 pt-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Master Data Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage dropdown options and reference data
                    </p>
                </div>
            </div>

            {/* Tabs for different master types */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MasterType)}>
                <TabsList>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="faq-categories">FAQ Categories</TabsTrigger>
                    <TabsTrigger value="plans">Plans</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-6 mt-6">
                    {/* Table Header with Search, Entries, Delete, Add */}
                    <TableHeaderComponent
                        entriesPerPage={pageSize}
                        onEntriesChange={setPageSize}
                        searchValue={search}
                        onSearchChange={handleSearchChange}
                        searchPlaceholder={`Search ${masterLabels[activeTab]}...`}
                        showDelete={true}
                        deleteDisabled={selectedIds.length === 0}
                        onDelete={handleDeleteClick}
                        actionButton={{
                            label: `Create ${masterLabels[activeTab].slice(0, -1)}`,
                            onClick: () => navigate(`/owner/master/create?type=${activeTab}`),
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
                </TabsContent>
            </Tabs>

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
            />
        </div>
    );
}
