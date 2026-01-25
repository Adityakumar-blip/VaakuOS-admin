import React, { useState, ReactNode } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    RowSelectionState,
    VisibilityState,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TablePagination } from '@/components/table/table-pagination';
import { cn } from '@/lib/utils';

export interface BulkAction<TData> {
    label: string;
    icon?: ReactNode;
    onClick: (selectedRows: TData[]) => void;
    variant?: "default" | "destructive";
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string; // Key to filter by (for global search)
    searchValue?: string;
    pageSize?: number;
    showPagination?: boolean;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: (value: RowSelectionState) => void;
    bulkActions?: BulkAction<TData>[];
    isLoading?: boolean;
    isFetching?: boolean; // For showing loading state during refetch (RTK Query)
    // Server-side pagination props
    currentPage?: number; // Current page number (1-indexed)
    totalPages?: number; // Total number of pages
    onPageChange?: (page: number) => void; // Callback when page changes
    // Client-side pagination control
    initialPageIndex?: number; // Initial page index (0-indexed)
    onPageIndexChange?: (pageIndex: number) => void; // Callback when page index changes (0-indexed)
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchValue,
    pageSize = 2,
    showPagination = true,
    rowSelection = {},
    onRowSelectionChange,
    bulkActions = [],
    isLoading = false,
    isFetching = false,
    currentPage,
    totalPages,
    onPageChange,
    initialPageIndex = 0,
    onPageIndexChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    // Internal pagination state
    const [pagination, setPagination] = useState({
        pageIndex: initialPageIndex,
        pageSize: pageSize,
    });

    // Update filters when search value changes
    React.useEffect(() => {
        if (searchKey && searchValue !== undefined) {
            setColumnFilters(prev => {
                const newFilters = prev.filter(f => f.id !== searchKey);
                if (searchValue) {
                    newFilters.push({ id: searchKey, value: searchValue });
                }
                return newFilters;
            });
            // Reset to first page on search
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
        }
    }, [searchKey, searchValue]);

    // Update pagination when pageSize prop changes
    React.useEffect(() => {
        setPagination(prev => ({ ...prev, pageSize: pageSize }));
    }, [pageSize]);

    // Notify parent when page index changes (for client-side pagination)
    React.useEffect(() => {
        if (onPageIndexChange && !currentPage) {
            onPageIndexChange(pagination.pageIndex);
        }
    }, [pagination.pageIndex, onPageIndexChange, currentPage]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: onRowSelectionChange ? (updater) => {
            // Handle both functional and value updates for row selection
            if (typeof updater === 'function') {
                onRowSelectionChange(updater(rowSelection));
            } else {
                onRowSelectionChange(updater);
            }
        } : undefined,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        enableRowSelection: true,
        // Manual pagination control if needed, but here we let the table handle logic
        pageCount: undefined,
    });

    // Get selected rows data
    const selectedRowsData = table.getFilteredSelectedRowModel().rows.map(row => row.original);
    const selectedCount = selectedRowsData.length;

    // Handle bulk action click
    const handleBulkAction = (action: BulkAction<TData>) => {
        action.onClick(selectedRowsData);
    };

    return (
        <div className="w-full space-y-4">
            {/* Top Bulk Action Bar - Removed for cleaner design */}

            <div className={cn("rounded-md border border-border bg-card overflow-hidden", isFetching && "relative")}>
                {isFetching && !isLoading && (
                    <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
                        <div className="text-sm text-muted-foreground">Updating...</div>
                    </div>
                )}
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="h-11">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-[400px] text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/30 transition-colors border-b border-border last:border-0"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showPagination && (currentPage && totalPages && onPageChange ? (
                // Server-side pagination
                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            ) : table.getPageCount() > 0 ? (
                // Client-side pagination
                <TablePagination
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalPages={table.getPageCount()}
                    onPageChange={(page) => table.setPageIndex(page - 1)}
                />
            ) : null)}

            {/* Sticky Bottom Bulk Action Bar - Sleek Design */}
            {selectedCount > 0 && bulkActions.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-2xl border border-gray-700 px-4 py-3 flex items-center gap-4">
                        <span className="text-sm font-medium">
                            {selectedCount} of 100 selected
                        </span>
                        <div className="h-4 w-px bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            {bulkActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleBulkAction(action)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors",
                                        action.variant === "destructive"
                                            ? "hover:bg-red-600/20 text-red-400 hover:text-red-300"
                                            : "hover:bg-gray-700 text-gray-300 hover:text-white"
                                    )}
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
