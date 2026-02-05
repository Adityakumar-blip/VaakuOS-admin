import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, FolderOpen } from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { DataTable } from '@/components/ui/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import {
    useGetMastersQuery,
    useDeleteMasterMutation,
} from '@/store/api/mastersApi';
import { type FAQCategory } from './types';

const FAQ_CATEGORIES_URL = '/faq-categories';

export default function FAQCategoriesPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const { pageSize, pageIndex, setPageSize, setPageIndex } = usePaginationState({
        defaultPageSize: 10,
        defaultPageIndex: 0,
    });

    const { data: response, isLoading } = useGetMastersQuery({
        url: FAQ_CATEGORIES_URL,
        params: search ? `?search=${encodeURIComponent(search)}` : '',
    });

    const categories = useMemo(() => {
        return Array.isArray(response) ? response : (response as { data?: FAQCategory[] })?.data || [];
    }, [response]);

    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    const [deleteCategory, { isLoading: isDeleting }] = useDeleteMasterMutation();

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPageIndex(0);
    };

    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteSingle = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (categoryToDelete) {
                await deleteCategory({ url: FAQ_CATEGORIES_URL, id: categoryToDelete }).unwrap();
                setCategoryToDelete(null);
            } else {
                const selectedIds = Object.keys(selectedRows);
                await Promise.all(
                    selectedIds.map((id) =>
                        deleteCategory({ url: FAQ_CATEGORIES_URL, id }).unwrap()
                    )
                );
                setSelectedRows({});
            }
            setDeleteConfirmOpen(false);
        } catch (error) {
            console.error('Failed to delete FAQ categories:', error);
        }
    };

    const filteredData = useMemo(() => {
        if (!search) return categories;
        return categories.filter(
            (category) =>
                category.name.toLowerCase().includes(search.toLowerCase()) ||
                category.code.toLowerCase().includes(search.toLowerCase()) ||
                category.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, categories]);

    const columns: ColumnDef<FAQCategory>[] = [
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
            accessorKey: 'order',
            header: 'Order',
            cell: ({ row }) => {
                return <span className="text-sm font-medium">{row.original.order}</span>;
            },
        },
        {
            accessorKey: 'name',
            header: 'Category',
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <FolderOpen size={16} />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{category.name}</p>
                            {category.description && (
                                <p className="text-xs text-muted-foreground">{category.description}</p>
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
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('is_active') as boolean;
                return (
                    <Badge variant={isActive ? 'default' : 'secondary'} className="capitalize">
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <RowActions
                        onEdit={() =>
                            navigate(`/owner/master/faq-categories/create?id=${category.id}&action=edit`)
                        }
                        onDelete={() => handleDeleteSingle(category.id)}
                        onView={() =>
                            navigate(`/owner/master/faq-categories/create?id=${category.id}&action=view`)
                        }
                    />
                );
            },
        },
    ];

    const selectedIds = Object.keys(selectedRows);

    const getDeleteMessage = () => {
        if (categoryToDelete) {
            const category = categories.find((c) => c.id === categoryToDelete);
            return {
                title: 'Delete FAQ Category',
                description: `Are you sure you want to delete "${category?.name}"? This action cannot be undone.`,
            };
        }
        return {
            title: 'Delete FAQ Categories',
            description: `Are you sure you want to delete ${selectedIds.length} selected categor${selectedIds.length > 1 ? 'ies' : 'y'
                }? This action cannot be undone.`,
        };
    };

    const deleteMessage = getDeleteMessage();

    return (
        <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">FAQ Categories</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage FAQ category classifications
                    </p>
                </div>
            </div>

            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search FAQ categories..."
                showDelete={true}
                deleteDisabled={selectedIds.length === 0}
                onDelete={handleDeleteClick}
                actionButton={{
                    label: 'Create FAQ Category',
                    onClick: () => navigate('/owner/master/faq-categories/create'),
                    icon: <Plus size={18} />,
                }}
            />

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

            <ConfirmationDialog
                open={deleteConfirmOpen}
                onOpenChange={(open) => {
                    setDeleteConfirmOpen(open);
                    if (!open) setCategoryToDelete(null);
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
