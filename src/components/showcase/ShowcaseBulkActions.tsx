import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    RefreshCw,
    Download,
    Copy,
    Trash2,
    ChevronDown,
    MoreHorizontal,
    Archive,
    Mail,
    Tag,
    FolderInput,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for tables
const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'inactive' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active' },
    { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'active' },
];

export function ShowcaseBulkActions() {
    // State for each table variant
    const [selected1, setSelected1] = useState<Record<string, boolean>>({});
    const [selected2, setSelected2] = useState<Record<string, boolean>>({});
    const [selected3, setSelected3] = useState<Record<string, boolean>>({});
    const [selected4, setSelected4] = useState<Record<string, boolean>>({});

    const selectedCount1 = Object.keys(selected1).filter(k => selected1[k]).length;
    const selectedCount2 = Object.keys(selected2).filter(k => selected2[k]).length;
    const selectedCount3 = Object.keys(selected3).filter(k => selected3[k]).length;
    const selectedCount4 = Object.keys(selected4).filter(k => selected4[k]).length;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Bulk Actions Design Patterns</h2>
                <p className="text-muted-foreground">
                    Compare different approaches for handling multiple bulk actions in tables.
                    Select rows in each table to see how the bulk actions appear.
                </p>
            </div>

            {/* Option 1: Inline Dropdown */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground">Option 1: Inline Dropdown</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Checkbox transforms into dropdown with all actions. Clean, minimal, matches GitHub/Linear.
                        </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        Recommended
                    </Badge>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    {selectedCount1 > 0 ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors">
                                                    {selectedCount1} selected
                                                    <ChevronDown size={14} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-56">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <RefreshCw size={14} className="mr-2" />
                                                        Change Status
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem>Active</DropdownMenuItem>
                                                        <DropdownMenuItem>Inactive</DropdownMenuItem>
                                                        <DropdownMenuItem>Pending</DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <Tag size={14} className="mr-2" />
                                                        Add Tags
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem>Important</DropdownMenuItem>
                                                        <DropdownMenuItem>Urgent</DropdownMenuItem>
                                                        <DropdownMenuItem>Review</DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>
                                                <DropdownMenuItem>
                                                    <Download size={14} className="mr-2" />
                                                    Export
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Copy size={14} className="mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Archive size={14} className="mr-2" />
                                                    Archive
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail size={14} className="mr-2" />
                                                    Send Email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 size={14} className="mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <Checkbox
                                            checked={selectedCount1 === mockUsers.length}
                                            onCheckedChange={(checked) => {
                                                const newSelected: Record<string, boolean> = {};
                                                if (checked) {
                                                    mockUsers.forEach(u => newSelected[u.id] = true);
                                                }
                                                setSelected1(newSelected);
                                            }}
                                        />
                                    )}
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selected1[user.id] || false}
                                            onCheckedChange={(checked) => {
                                                setSelected1(prev => ({ ...prev, [user.id]: !!checked }));
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>

            {/* Option 2: Inline Buttons */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-4">
                <div>
                    <h3 className="text-xl font-semibold text-foreground">Option 2: Inline Buttons</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Action buttons appear next to selection count in header. Most discoverable but takes space.
                    </p>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-auto" colSpan={5}>
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            checked={selectedCount2 === mockUsers.length}
                                            onCheckedChange={(checked) => {
                                                const newSelected: Record<string, boolean> = {};
                                                if (checked) {
                                                    mockUsers.forEach(u => newSelected[u.id] = true);
                                                }
                                                setSelected2(newSelected);
                                            }}
                                        />
                                        {selectedCount2 > 0 && (
                                            <>
                                                <span className="text-sm font-medium">{selectedCount2} selected</span>
                                                <div className="flex items-center gap-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="sm" variant="outline" className="h-7 gap-1">
                                                                <RefreshCw size={12} />
                                                                Status
                                                                <ChevronDown size={12} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem>Active</DropdownMenuItem>
                                                            <DropdownMenuItem>Inactive</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <Button size="sm" variant="outline" className="h-7 gap-1">
                                                        <Download size={12} />
                                                        Export
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-7 gap-1">
                                                        <Copy size={12} />
                                                        Duplicate
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-7 gap-1 text-red-600 hover:text-red-700">
                                                        <Trash2 size={12} />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selected2[user.id] || false}
                                            onCheckedChange={(checked) => {
                                                setSelected2(prev => ({ ...prev, [user.id]: !!checked }));
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>

            {/* Option 3: Hybrid */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-4">
                <div>
                    <h3 className="text-xl font-semibold text-foreground">Option 3: Hybrid (Primary + More)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Shows primary action inline, others in "More" menu. Good balance between visibility and space.
                    </p>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-auto" colSpan={5}>
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            checked={selectedCount3 === mockUsers.length}
                                            onCheckedChange={(checked) => {
                                                const newSelected: Record<string, boolean> = {};
                                                if (checked) {
                                                    mockUsers.forEach(u => newSelected[u.id] = true);
                                                }
                                                setSelected3(newSelected);
                                            }}
                                        />
                                        {selectedCount3 > 0 && (
                                            <>
                                                <span className="text-sm font-medium">{selectedCount3} selected</span>
                                                <div className="flex items-center gap-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="sm" variant="default" className="h-7 gap-1">
                                                                <RefreshCw size={12} />
                                                                Change Status
                                                                <ChevronDown size={12} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem>Active</DropdownMenuItem>
                                                            <DropdownMenuItem>Inactive</DropdownMenuItem>
                                                            <DropdownMenuItem>Pending</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="sm" variant="outline" className="h-7 gap-1">
                                                                <MoreHorizontal size={14} />
                                                                More
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Download size={14} className="mr-2" />
                                                                Export
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Copy size={14} className="mr-2" />
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Archive size={14} className="mr-2" />
                                                                Archive
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <FolderInput size={14} className="mr-2" />
                                                                Move to
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 size={14} className="mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selected3[user.id] || false}
                                            onCheckedChange={(checked) => {
                                                setSelected3(prev => ({ ...prev, [user.id]: !!checked }));
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>

            {/* Option 4: Bottom Bar */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-4">
                <div>
                    <h3 className="text-xl font-semibold text-foreground">Option 4: Bottom Sticky Bar</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Dark bar at bottom of viewport. Doesn't interfere with table, always visible. Airtable/Notion style.
                    </p>
                </div>

                <div className="rounded-md border relative">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedCount4 === mockUsers.length}
                                        onCheckedChange={(checked) => {
                                            const newSelected: Record<string, boolean> = {};
                                            if (checked) {
                                                mockUsers.forEach(u => newSelected[u.id] = true);
                                            }
                                            setSelected4(newSelected);
                                        }}
                                    />
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selected4[user.id] || false}
                                            onCheckedChange={(checked) => {
                                                setSelected4(prev => ({ ...prev, [user.id]: !!checked }));
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Bottom Bar (simulated - not actually fixed in showcase) */}
                    {selectedCount4 > 0 && (
                        <div className="mt-4 bg-slate-900 dark:bg-slate-900 text-white h-14 flex items-center justify-between px-6 rounded-lg shadow-2xl">
                            <span className="text-sm text-white/90">
                                {selectedCount4} of {mockUsers.length} selected
                            </span>
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="h-8 px-3 text-xs font-medium rounded-md bg-white/10 hover:bg-white/20 flex items-center gap-2 transition-colors">
                                            <RefreshCw size={14} />
                                            Change status
                                            <ChevronDown size={14} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Active</DropdownMenuItem>
                                        <DropdownMenuItem>Inactive</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <button className="h-8 px-3 text-xs font-medium rounded-md bg-white/10 hover:bg-white/20 flex items-center gap-2 transition-colors">
                                    <Download size={14} />
                                    Export
                                </button>
                                <button className="h-8 px-3 text-xs font-medium rounded-md bg-white/10 hover:bg-white/20 flex items-center gap-2 transition-colors">
                                    <Copy size={14} />
                                    Duplicate
                                </button>
                                <button className="h-8 px-3 text-xs font-medium rounded-md text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Comparison Summary */}
            <section className="bg-muted/30 rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card p-4 rounded-lg border">
                        <h4 className="font-medium mb-2">Inline Dropdown</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>✅ Minimal space</p>
                            <p>✅ Clean design</p>
                            <p>✅ Scalable (10+ actions)</p>
                            <p>⚠️ One extra click</p>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border">
                        <h4 className="font-medium mb-2">Inline Buttons</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>✅ Immediately visible</p>
                            <p>✅ No extra clicks</p>
                            <p>⚠️ Takes header space</p>
                            <p>⚠️ Limited actions (3-4)</p>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border">
                        <h4 className="font-medium mb-2">Hybrid</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>✅ Balanced approach</p>
                            <p>✅ Highlights primary action</p>
                            <p>✅ Moderate space usage</p>
                            <p>⚠️ Requires prioritization</p>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border">
                        <h4 className="font-medium mb-2">Bottom Bar</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>✅ Always visible</p>
                            <p>✅ Unlimited actions</p>
                            <p>✅ Doesn't interfere</p>
                            <p>⚠️ Takes screen space</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
