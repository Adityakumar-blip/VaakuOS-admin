import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Trash2 } from 'lucide-react';
import { ShowEntriesSelect } from './show-entries-select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TableHeaderProps {
    // Pagination
    entriesPerPage: number;
    onEntriesChange: (value: number) => void;

    // Search
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;

    // Actions
    actionButton?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };

    // Delete
    showDelete?: boolean;
    deleteDisabled?: boolean;
    onDelete?: () => void;

    // Filter
    showFilter?: boolean;
    children?: React.ReactNode; // Filter content
}

export function TableHeader({
    entriesPerPage,
    onEntriesChange,
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    actionButton,
    showDelete = false,
    deleteDisabled = true,
    onDelete,
    showFilter = false,
    children,
}: TableHeaderProps) {
    return (
        <div className="w-full mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* Left: Show Entries */}
                <div className="min-w-[200px]">
                    <ShowEntriesSelect value={entriesPerPage} onChange={onEntriesChange} />
                </div>

                {/* Right: Filter, Search, Delete, Action Button */}
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto">
                    {/* Filter Button */}
                    {showFilter && children && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="default" className="gap-2">
                                    <Filter size={16} />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[300px]">
                                {children}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Search Field */}
                    <div className="relative w-full sm:w-[300px]">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Delete Button */}
                    {showDelete && (
                        <Button
                            variant="destructive"
                            onClick={onDelete}
                            disabled={deleteDisabled}
                            className="gap-2"
                        >
                            <Trash2 size={16} />
                            Delete
                        </Button>
                    )}

                    {/* Action Button */}
                    {actionButton && (
                        <Button onClick={actionButton.onClick} className="gap-2">
                            {actionButton.icon}
                            {actionButton.label}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
