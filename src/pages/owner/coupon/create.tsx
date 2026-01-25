import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function CouponCreatePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const isView = action === 'view';
    const isEdit = action === 'edit';

    // Form state
    const [plan, setPlan] = useState<string>('');
    const [couponCode, setCouponCode] = useState('');
    const [maxUsers, setMaxUsers] = useState('');
    const [discount, setDiscount] = useState('');
    const [validityDays, setValidityDays] = useState('');
    const [status, setStatus] = useState<string>('active');

    const generateCouponCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCouponCode(code);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            plan,
            couponCode,
            maxUsers: parseInt(maxUsers),
            discount: parseFloat(discount),
            validityDays: parseInt(validityDays),
        };
        console.log('Coupon Payload:', payload);
        navigate('/owner/coupon');
    };

    return (
        <div className="space-y-6 pt-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/owner/coupon')}
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        {isView ? 'View' : isEdit ? 'Edit' : 'Create'} Coupon
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    {/* Plan Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="plan">Plan *</Label>
                        <Select value={plan} onValueChange={setPlan} disabled={isView}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="basic">Basic Plan</SelectItem>
                                <SelectItem value="premium">Premium Plan</SelectItem>
                                <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Coupon Code with Auto Generate */}
                    <div className="space-y-2">
                        <Label htmlFor="couponCode">Coupon Code *</Label>
                        <div className="flex gap-2">
                            <Input
                                id="couponCode"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Enter or generate coupon code"
                                disabled={isView}
                                required
                                className="flex-1 font-mono"
                            />
                            {!isView && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={generateCouponCode}
                                    className="flex-shrink-0"
                                >
                                    <RefreshCw size={16} className="mr-2" />
                                    Auto Generate
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Max Users */}
                    <div className="space-y-2">
                        <Label htmlFor="maxUsers">Max Users *</Label>
                        <Input
                            id="maxUsers"
                            type="number"
                            value={maxUsers}
                            onChange={(e) => setMaxUsers(e.target.value)}
                            placeholder="Enter maximum number of users"
                            disabled={isView}
                            required
                            min="1"
                        />
                        <p className="text-xs text-muted-foreground">
                            Maximum number of users who can use this coupon
                        </p>
                    </div>

                    {/* Discount Percentage */}
                    <div className="space-y-2">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="Enter discount percentage"
                            disabled={isView}
                            min="0"
                            max="100"
                            step="0.01"
                        />
                    </div>

                    {/* Validity Days */}
                    <div className="space-y-2">
                        <Label htmlFor="validityDays">Validity (Days)</Label>
                        <Input
                            id="validityDays"
                            type="number"
                            value={validityDays}
                            onChange={(e) => setValidityDays(e.target.value)}
                            placeholder="Enter validity period in days"
                            disabled={isView}
                            min="1"
                        />
                        <p className="text-xs text-muted-foreground">
                            Number of days the coupon will be valid from creation
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
                                        ? 'Coupon is available for use'
                                        : 'Coupon is disabled'}
                                </p>
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
                            onClick={() => navigate('/owner/coupon')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEdit ? 'Update' : 'Create'} Coupon
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
