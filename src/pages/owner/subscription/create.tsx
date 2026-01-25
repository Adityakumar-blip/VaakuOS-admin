import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, GripVertical, X, ArrowLeft } from 'lucide-react';

interface DynamicField {
    id: string;
    value: string;
}

export default function SubscriptionCreatePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const isView = action === 'view';
    const isEdit = action === 'edit';

    // Form state
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [status, setStatus] = useState<string>('active');
    const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([
        { id: '1', value: '' }
    ]);

    // Drag state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleAddField = () => {
        setDynamicFields([...dynamicFields, { id: Date.now().toString(), value: '' }]);
    };

    const handleRemoveField = (id: string) => {
        setDynamicFields(dynamicFields.filter(field => field.id !== id));
    };

    const handleFieldChange = (id: string, value: string) => {
        setDynamicFields(dynamicFields.map(field =>
            field.id === id ? { ...field, value } : field
        ));
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newFields = [...dynamicFields];
        const draggedItem = newFields[draggedIndex];
        newFields.splice(draggedIndex, 1);
        newFields.splice(index, 0, draggedItem);

        setDynamicFields(newFields);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            title,
            subtitle,
            description,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
            status,
            dynamicFields: dynamicFields.map((field, index) => ({
                order: index + 1,
                value: field.value
            }))
        };
        console.log('Subscription Payload:', payload);
        navigate('/owner/subscription');
    };

    return (
        <div className="space-y-6 pt-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/owner/subscription')}
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        {isView ? 'View' : isEdit ? 'Edit' : 'Create'} Subscription
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter subscription title"
                            disabled={isView}
                            required
                        />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtitle *</Label>
                        <Input
                            id="subtitle"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Enter subscription subtitle"
                            disabled={isView}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter subscription description"
                            disabled={isView}
                            rows={4}
                            required
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div className="space-y-2">
                            <Label>Start Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !startDate && "text-muted-foreground"
                                        )}
                                        disabled={isView}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <Label>End Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !endDate && "text-muted-foreground"
                                        )}
                                        disabled={isView}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
                            <Switch
                                id="status"
                                checked={status === 'active'}
                                onCheckedChange={(checked) => setStatus(checked ? 'active' : 'inactive')}
                                disabled={isView}
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    {status === 'active' ? 'Active' : 'Inactive'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {status === 'active'
                                        ? 'Subscription is available for users'
                                        : 'Subscription is disabled'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Fields */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Additional Fields</Label>
                            {!isView && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddField}
                                >
                                    <Plus size={16} className="mr-2" />
                                    Add Field
                                </Button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {dynamicFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    draggable={!isView}
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={cn(
                                        "flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border",
                                        !isView && "cursor-move hover:bg-muted transition-colors",
                                        draggedIndex === index && "opacity-50"
                                    )}
                                >
                                    {!isView && (
                                        <GripVertical size={20} className="text-muted-foreground flex-shrink-0" />
                                    )}
                                    <Input
                                        value={field.value}
                                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        placeholder={`Field ${index + 1}`}
                                        disabled={isView}
                                        className="flex-1"
                                    />
                                    {!isView && dynamicFields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveField(field.id)}
                                            className="flex-shrink-0"
                                        >
                                            <X size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {!isView && (
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/owner/subscription')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEdit ? 'Update' : 'Create'} Subscription
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
