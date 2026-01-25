import React, { useState } from 'react';
import { roleDesignData } from '@/constants/roleDesignData';
import { ChevronRight, ChevronDown, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';

// Define strict types for the Role Data
interface RoleNode {
    checked?: boolean;
    children?: { [key: string]: RoleNode | boolean };
    [key: string]: RoleNode | boolean | undefined; // Allow other string keys for nested nodes or boolean values
}

const formatLabel = (key: string) => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};

export default function AgencyCreateRolePage() {
    const navigate = useNavigate();
    const [rolesState, setRolesState] = useState<RoleNode>(roleDesignData as RoleNode);
    const [selectedPath, setSelectedPath] = useState<string[]>(['Request']);
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');

    // Helper to get data at a specific path
    const getDataAtPath = (path: string[], currentData: RoleNode): RoleNode | boolean | null => {
        let current: RoleNode | boolean = currentData;
        for (const key of path) {
            if (current && typeof current === 'object' && key in current) {
                current = (current as RoleNode)[key] as RoleNode | boolean;
            } else {
                return null;
            }
        }
        return current;
    };

    const selectedData = getDataAtPath(selectedPath, rolesState);

    const handlePermissionChange = (path: string[], checked: boolean) => {
        setRolesState((prevState) => {
            const newState = JSON.parse(JSON.stringify(prevState)) as RoleNode;
            let current: Record<string, RoleNode | boolean | undefined> = newState;
            // Navigate to parent
            const parentPath = path.slice(0, -1);
            const key = path[path.length - 1];

            for (const p of parentPath) {
                current = current[p] as Record<string, RoleNode | boolean | undefined>;
            }
            current[key] = checked;
            return newState;
        });
    };

    // recursive helper to check/uncheck all
    const toggleAll = (path: string[], data: RoleNode | boolean, checked: boolean) => {
        setRolesState((prevState) => {
            const newState = JSON.parse(JSON.stringify(prevState)) as RoleNode;

            const setRecursive = (obj: Record<string, RoleNode | boolean | undefined>, val: boolean) => {
                Object.keys(obj).forEach(k => {
                    const value = obj[k];
                    if (typeof value === 'boolean') {
                        obj[k] = val;
                    } else if (typeof value === 'object' && value !== null) {
                        if ('checked' in value) {
                            (value as RoleNode).checked = val;
                        }
                        if ('children' in value) {
                            setRecursive((value as RoleNode).children as Record<string, RoleNode | boolean | undefined>, val);
                        } else {
                            // Folders might just have nesting
                            setRecursive(value as Record<string, RoleNode | boolean | undefined>, val);
                        }
                    }
                });
            }

            let current: Record<string, RoleNode | boolean | undefined> = newState;
            for (const p of path) {
                current = current[p] as Record<string, RoleNode | boolean | undefined>;
            }

            setRecursive(current, checked);
            return newState;
        });
    };


    // -- Navigation Tree (Left Panel) --
    const NavigationTree = ({
        node,
        path,
        level = 0
    }: {
        node: RoleNode;
        path: string[];
        level?: number;
    }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        // Check if this node has children (is an object and has nesting)
        // Exclude 'children' key from count if it exists, but usually we just check if there are sub-objects
        const hasChildren = Object.entries(node).some(
            ([key, value]) => key !== 'children' && typeof value === 'object' && value !== null
        );

        const isSelected = JSON.stringify(path) === JSON.stringify(selectedPath);

        const handleSelect = (e: React.MouseEvent) => {
            e.stopPropagation();
            setSelectedPath(path);
            if (hasChildren && !isExpanded) {
                setIsExpanded(true);
            }
        };

        const handleToggle = (e: React.MouseEvent) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        };

        if (level === 0) {
            return (
                <div className="space-y-1">
                    {Object.entries(node).map(([key, value]) => {
                        // Filter top level, skip 'children'
                        if (key !== 'children' && typeof value === 'object' && value !== null) {
                            return (
                                <NavigationTree
                                    key={key}
                                    node={value as RoleNode}
                                    path={[key]}
                                    level={level + 1}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            );
        }

        const label = formatLabel(path[path.length - 1]);

        return (
            <div className="select-none">
                <div
                    className={cn(
                        "flex items-center py-2 px-2 cursor-pointer rounded-md transition-colors",
                        isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted",
                    )}
                    style={{ paddingLeft: `${(level - 1) * 12 + 8}px` }}
                    onClick={handleSelect}
                >
                    {hasChildren ? (
                        <button
                            onClick={handleToggle}
                            className="mr-1 p-1 hover:bg-primary/20 rounded-sm"
                        >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    ) : (
                        <span className="w-6" />
                    )}

                    <span className="truncate text-sm">{label}</span>
                </div>

                {isExpanded && hasChildren && (
                    <div className="mt-1">
                        {Object.entries(node).map(([key, value]) => {
                            if (key !== 'children' && typeof value === 'object' && value !== null) {
                                return (
                                    <NavigationTree
                                        key={key}
                                        node={value as RoleNode}
                                        path={[...path, key]}
                                        level={level + 1}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        );
    };

    const PermissionGroupToggle = ({
        label,
        isChecked,
        fullPath,
        onToggle,
        childrenContent
    }: {
        label: string,
        isChecked: boolean,
        fullPath: string[],
        onToggle: (v: boolean) => void,
        childrenContent: React.ReactNode
    }) => {
        const [isOpen, setIsOpen] = useState(true);

        return (
            <div className="w-full">
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                        className="p-0.5 hover:bg-primary/20 rounded-sm transition-colors text-muted-foreground mr-1"
                    >
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={fullPath.join('-')}
                            checked={isChecked}
                            onCheckedChange={(checked) => onToggle(checked as boolean)}
                        />
                        <Label
                            htmlFor={fullPath.join('-')}
                            className="text-sm cursor-pointer font-normal select-none"
                        >
                            {formatLabel(label)}
                        </Label>
                    </div>
                </div>

                {isOpen && (
                    <div className="border-l border-border/40 ml-[7px] mt-1 mb-2 pl-4">
                        {childrenContent}
                    </div>
                )}
            </div>
        )
    };

    const PermissionNode = ({
        data,
        path,
        isRoot = false,
        lastChild = false
    }: {
        data: RoleNode | boolean;
        path: string[];
        isRoot?: boolean;
        lastChild?: boolean;
    }) => {
        const entries = Object.entries(data);

        return (
            <div className={cn("relative", !isRoot && "ml-6")}>
                {!isRoot && !lastChild && (
                    <div className="absolute left-[-13px] top-0 bottom-0 w-px bg-border group-hover:bg-primary/30" />
                )}

                {entries.map(([key, value], index) => {
                    const isLast = index === entries.length - 1;
                    const fullPath = [...path, key];

                    const isBoolean = typeof value === 'boolean';
                    const isObject = typeof value === 'object' && value !== null;
                    const hasCheckedProp = isObject && 'checked' in value;

                    // Type assertion for value as object access
                    const typedValue = value as RoleNode;
                    const hasChildren = isObject && 'children' in typedValue && typedValue.children && Object.keys(typedValue.children).length > 0;

                    const isChecked = isBoolean ? value : (hasCheckedProp ? typedValue.checked : false);
                    const showCheckbox = isBoolean || hasCheckedProp;

                    return (
                        <div key={key} className="relative group">
                            {/* L-Shape Connectors */}
                            {!isRoot && (
                                <>
                                    <div className={cn(
                                        "absolute left-[-13px] top-[-10px] w-px bg-border",
                                        isLast ? "h-[24px]" : "h-full"
                                    )} />
                                    <div className="absolute left-[-13px] top-[14px] w-[12px] h-px bg-border" />
                                </>
                            )}

                            <div className={cn("py-1", !isRoot && "pl-0")}>
                                {showCheckbox ? (
                                    <div className="flex items-center gap-2 p-1 rounded hover:bg-muted/50 transition-colors">
                                        {hasChildren ? (
                                            <PermissionGroupToggle
                                                label={key}
                                                isChecked={isChecked as boolean}
                                                fullPath={fullPath}
                                                onToggle={(checked) => handlePermissionChange(hasCheckedProp ? [...fullPath, 'checked'] : fullPath, checked)}
                                                childrenContent={
                                                    <PermissionNode
                                                        data={typedValue.children}
                                                        path={[...fullPath, 'children']}
                                                        isRoot={false}
                                                        lastChild={true}
                                                    />
                                                }
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={fullPath.join('-')}
                                                    checked={isChecked as boolean}
                                                    onCheckedChange={(checked) => handlePermissionChange(hasCheckedProp ? [...fullPath, 'checked'] : fullPath, checked as boolean)}
                                                />
                                                <Label
                                                    htmlFor={fullPath.join('-')}
                                                    className="text-sm cursor-pointer font-normal select-none"
                                                >
                                                    {formatLabel(key)}
                                                </Label>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Just a folder object
                                    isObject && (
                                        <div className="ml-4">
                                            <PermissionNode
                                                data={value}
                                                path={fullPath}
                                                isRoot={false}
                                                lastChild={isLast}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/agency/team/role')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Create Role</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/agency/team/role')}>Cancel</Button>
                    <Button>Create Role</Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name<span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            placeholder="Name"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[38px] resize-none"
                            rows={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="permissions" className="flex-1 flex flex-col">
                <TabsList>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>

                <TabsContent value="permissions" className="flex-1 flex gap-6 mt-6 min-h-0">
                    <div className="w-[300px] border rounded-lg p-4 custom-scrollbar overflow-y-auto bg-card">
                        <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Modules
                        </div>
                        <NavigationTree node={rolesState} path={[]} level={0} />
                    </div>

                    <div className="flex-1 border rounded-lg p-6 bg-card overflow-y-auto">
                        <div className="flex items-center justify-between mb-6 pb-2 border-b">
                            <span className="font-semibold text-lg flex items-center gap-2">
                                {selectedPath.map(p => formatLabel(p)).join(' > ')}
                            </span>
                            <div className="flex gap-2 text-xs">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => selectedData && toggleAll(selectedPath, selectedData, true)}
                                >
                                    Select All
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => selectedData && toggleAll(selectedPath, selectedData, false)}
                                >
                                    Deselect All
                                </Button>
                            </div>
                        </div>

                        <div className="pl-2">
                            {selectedData ? (
                                <PermissionNode data={selectedData} path={selectedPath} isRoot={true} />
                            ) : (
                                <div className="text-muted-foreground">Select a module to view permissions</div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="users">
                    <div className="flex items-center justify-center h-48 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">User assignment module coming soon</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
