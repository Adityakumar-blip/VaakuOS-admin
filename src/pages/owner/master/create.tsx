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
import { ArrowLeft } from 'lucide-react';

const masterTypeLabels: Record<string, string> = {
    'features': 'Feature',
    'faq-categories': 'FAQ Category',
    'plans': 'Plan',
    'integrations': 'Integration',
};

export default function MasterCreatePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'features';
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const isView = action === 'view';
    const isEdit = action === 'edit';

    const masterLabel = masterTypeLabels[type] || 'Item';

    // Form state
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<string>('active');
    const [order, setOrder] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            type,
            name,
            value,
            description,
            status,
            order: parseInt(order),
        };
        console.log('Master Data Payload:', payload);
        navigate(`/owner/master?tab=${type}`);
    };

    return (
        <div className="space-y-6 pt-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/owner/master')}
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        {isView ? 'View' : isEdit ? 'Edit' : 'Create'} {masterLabel}
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`Enter ${masterLabel.toLowerCase()} name`}
                            disabled={isView}
                            required
                        />
                    </div>

                    {/* Value */}
                    <div className="space-y-2">
                        <Label htmlFor="value">Value *</Label>
                        <Input
                            id="value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Enter ${masterLabel.toLowerCase()} value (lowercase, no spaces)`}
                            disabled={isView}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            This will be used as the internal identifier
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={`Enter ${masterLabel.toLowerCase()} description`}
                            disabled={isView}
                            rows={3}
                        />
                    </div>

                    {/* Order and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order */}
                        <div className="space-y-2">
                            <Label htmlFor="order">Display Order *</Label>
                            <Input
                                id="order"
                                type="number"
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                                placeholder="Enter display order"
                                disabled={isView}
                                required
                                min="1"
                            />
                            <p className="text-xs text-muted-foreground">
                                Lower numbers appear first
                            </p>
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
                                            ? 'Item is available for use'
                                            : 'Item is hidden'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {!isView && (
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/owner/master')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEdit ? 'Update' : 'Create'} {masterLabel}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
