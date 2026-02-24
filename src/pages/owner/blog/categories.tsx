import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Tag, Folder } from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useGetCategoriesQuery, useCreateCategoryMutation, BlogCategory } from '@/store/api/blogApi';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

export default function BlogCategoriesPage() {
    const navigate = useNavigate();
    const { data: categories = [], isLoading } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();

    // Pagination state
    const { pageSize, pageIndex, setPageSize, setPageIndex } = usePaginationState({
        defaultPageSize: 10,
        defaultPageIndex: 0,
    });

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        slug: '',
        description: '',
    });

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setNewCategory({ ...newCategory, name, slug });
    };

    const handleCreateCategory = async () => {
        try {
            await createCategory(newCategory).unwrap();
            setIsCreateDialogOpen(false);
            setNewCategory({ name: '', slug: '', description: '' });
        } catch (error) {
            // Error is handled by global toast
        }
    };

    const columns: ColumnDef<BlogCategory>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Folder size={16} />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">{row.original.name}</p>
                        <p className="text-xs text-muted-foreground">{row.original.slug}</p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <p className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                    {row.original.description || '-'}
                </p>
            )
        },
        {
            accessorKey: "_count.blogs",
            header: "Blogs Count",
            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original._count?.blogs || 0}
                </Badge>
            )
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="text-right">
                    <RowActions
                        onEdit={() => {
                            // Implement edit if needed
                            toast.info("Edit category coming soon");
                        }}
                        onDelete={() => {
                            // Implement delete if needed
                            toast.info("Delete category coming soon");
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/owner/blog')}
                    >
                        <Tag size={20} />
                    </Button>
                    <h1 className="text-2xl font-semibold text-foreground">Blog Categories</h1>
                </div>
            </div>

            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue=""
                onSearchChange={() => { }}
                searchPlaceholder="Search categories..."
                actionButton={{
                    label: 'Add Category',
                    onClick: () => setIsCreateDialogOpen(true),
                    icon: <Plus size={18} />,
                }}
            />

            <DataTable
                columns={columns}
                data={categories}
                isLoading={isLoading}
                showPagination={true}
                pageSize={pageSize}
                initialPageIndex={pageIndex}
                onPageIndexChange={setPageIndex}
            />

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                            Add a new category to organize your blog posts.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={newCategory.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g. Technology"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={newCategory.slug}
                                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                                placeholder="e.g. technology"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                placeholder="Describe this category"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCategory} disabled={!newCategory.name || !newCategory.slug}>
                            Create Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
