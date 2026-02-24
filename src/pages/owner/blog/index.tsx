import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginationState } from '@/hooks/usePaginationState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, LayoutGrid, Tag, Eye, MessageSquare, Calendar } from 'lucide-react';
import { TableHeader as TableHeaderComponent, RowActions } from '@/components/table';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useGetAdminBlogsQuery, useDeleteBlogMutation, Blog } from '@/store/api/blogApi';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function BlogsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const { data: blogs = [], isLoading } = useGetAdminBlogsQuery();
    const [deleteBlog] = useDeleteBlogMutation();

    // Pagination state
    const { pageSize, pageIndex, setPageSize, setPageIndex } = usePaginationState({
        defaultPageSize: 10,
        defaultPageIndex: 0,
    });

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

    const filteredBlogs = useMemo(() => {
        return blogs.filter(
            (blog) =>
                blog.title.toLowerCase().includes(search.toLowerCase()) ||
                blog.category?.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [blogs, search]);

    const handleDeleteSingle = (id: string) => {
        setBlogToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (blogToDelete) {
            try {
                await deleteBlog(blogToDelete).unwrap();
                toast.success('Blog deleted successfully');
                setBlogToDelete(null);
                setDeleteConfirmOpen(false);
            } catch (error) {
                // Error handled by global toast
            }
        }
    };

    const columns: ColumnDef<Blog>[] = [
        {
            accessorKey: "title",
            header: "Blog Post",
            cell: ({ row }) => {
                const blog = row.original;
                return (
                    <div className="flex items-center gap-3 max-w-[400px]">
                        {blog.featured_image ? (
                            <img
                                src={blog.featured_image}
                                alt={blog.title}
                                className="w-12 h-12 rounded-lg object-cover bg-muted"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <LayoutGrid size={20} />
                            </div>
                        )}
                        <div className="truncate">
                            <p className="font-medium text-foreground truncate">{blog.title}</p>
                            <p className="text-xs text-muted-foreground">/{blog.slug}</p>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "category.name",
            header: "Category",
            cell: ({ row }) => (
                <Badge variant="outline" className="font-normal">
                    {row.original.category?.name || 'Uncategorized'}
                </Badge>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                    published: "default",
                    draft: "secondary",
                    archived: "outline",
                };
                return (
                    <Badge variant={variants[status]} className="capitalize">
                        {status}
                    </Badge>
                );
            }
        },
        {
            header: "Stats",
            cell: ({ row }) => (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {row.original.view_count || 0}
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        {row.original._count?.comments || 0}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "created_at",
            header: "Created",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    {format(new Date(row.original.created_at), 'MMM dd, yyyy')}
                </div>
            )
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="text-right">
                    <RowActions
                        onEdit={() => navigate(`/owner/blog/create?id=${row.original.id}&action=edit`)}
                        onDelete={() => handleDeleteSingle(row.original.id)}
                        onView={() => window.open(`/blog/post/${row.original.slug}`, '_blank')}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold text-foreground">Blog Management</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/owner/blog/categories')}
                        className="gap-2"
                    >
                        <Tag size={18} />
                        Categories
                    </Button>
                    <Button
                        onClick={() => navigate('/owner/blog/create')}
                        className="gap-2"
                    >
                        <Plus size={18} />
                        Create Blog
                    </Button>
                </div>
            </div>

            <TableHeaderComponent
                entriesPerPage={pageSize}
                onEntriesChange={setPageSize}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search blogs..."
            />

            <DataTable
                columns={columns}
                data={filteredBlogs}
                isLoading={isLoading}
                showPagination={true}
                pageSize={pageSize}
                initialPageIndex={pageIndex}
                onPageIndexChange={setPageIndex}
            />

            <ConfirmationDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Blog Post"
                description="Are you sure you want to delete this blog post? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
