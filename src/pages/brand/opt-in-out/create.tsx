import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    useGetAutoResponseByIdQuery,
    useAddAutoResponseMutation,
    useUpdateAutoResponseMutation,
} from '@/store/api/autoResponseApi';
import { useToast } from '@/hooks/use-toast';

export default function BrandOptInOutFormPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();

    // Determine if we're in edit mode
    const isEditMode = Boolean(id);

    // Fetch auto-response data if editing
    const { data: autoResponse, isLoading: isLoadingAutoResponse } = useGetAutoResponseByIdQuery(id || '', {
        skip: !isEditMode,
    });

    const [addAutoResponse, { isLoading: isCreating }] = useAddAutoResponseMutation();
    const [updateAutoResponse, { isLoading: isUpdating }] = useUpdateAutoResponseMutation();

    // Form state
    const [keyword, setKeyword] = useState('');
    const [action, setAction] = useState<'opt_in' | 'opt_out'>('opt_out');
    const [replyText, setReplyText] = useState('');
    const [isActive, setIsActive] = useState(true);

    // Populate form when auto-response data is loaded (edit mode)
    useEffect(() => {
        if (autoResponse && isEditMode) {
            setKeyword(autoResponse.keyword);
            setAction(autoResponse.action);
            setReplyText(autoResponse.reply_text);
            setIsActive(autoResponse.is_active);
        }
    }, [autoResponse, isEditMode]);

    const handleSubmit = async () => {
        // Validation
        if (!keyword.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Keyword is required',
                variant: 'destructive',
            });
            return;
        }

        if (!replyText.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Reply text is required',
                variant: 'destructive',
            });
            return;
        }

        try {
            const data = {
                keyword: keyword.trim().toUpperCase(),
                action,
                reply_text: replyText.trim(),
                is_active: isActive,
            };

            if (isEditMode && id) {
                await updateAutoResponse({ id, data }).unwrap();
                toast({
                    title: 'Success',
                    description: 'Auto response updated successfully',
                });
            } else {
                await addAutoResponse(data).unwrap();
                toast({
                    title: 'Success',
                    description: 'Auto response created successfully',
                });
            }

            navigate('/brand/opt-in-out');
        } catch (error) {
            console.error('Failed to save auto response:', error);
            toast({
                title: 'Error',
                description: `Failed to ${isEditMode ? 'update' : 'create'} auto response. Please try again.`,
                variant: 'destructive',
            });
        }
    };

    // Loading state for edit mode
    if (isEditMode && isLoadingAutoResponse) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Not found state for edit mode
    if (isEditMode && !autoResponse && !isLoadingAutoResponse) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
                <p className="text-muted-foreground">Auto response not found</p>
                <Button onClick={() => navigate('/brand/opt-in-out')}>Back to List</Button>
            </div>
        );
    }

    const isLoading = isCreating || isUpdating;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/brand/opt-in-out')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditMode ? 'Edit Auto Response' : 'Create Auto Response'}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/brand/opt-in-out')}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? 'Save Changes' : 'Create'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Auto Response Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Keyword */}
                        <div className="space-y-2">
                            <Label htmlFor="keyword">
                                Keyword<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="keyword"
                                placeholder="e.g., STOP, START"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                                maxLength={50}
                            />
                            <p className="text-xs text-muted-foreground">
                                The keyword users will send (automatically converted to uppercase)
                            </p>
                        </div>

                        {/* Action */}
                        <div className="space-y-2">
                            <Label htmlFor="action">
                                Action<span className="text-red-500">*</span>
                            </Label>
                            <Select value={action} onValueChange={(value: 'opt_in' | 'opt_out') => setAction(value)}>
                                <SelectTrigger id="action">
                                    <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="opt_out">Opt Out</SelectItem>
                                    <SelectItem value="opt_in">Opt In</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                What happens when user sends this keyword
                            </p>
                        </div>
                    </div>

                    {/* Reply Text */}
                    <div className="space-y-2">
                        <Label htmlFor="reply_text">
                            Reply Text<span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reply_text"
                            placeholder="Enter the automatic reply message..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground">
                            The message that will be sent automatically when user sends the keyword ({replyText.length}/500)
                        </p>
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active" className="text-base">
                                Active Status
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Enable or disable this auto response
                            </p>
                        </div>
                        <Switch
                            id="is_active"
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>

                    {/* Example Preview */}
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                        <h3 className="font-semibold text-sm">Preview</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-medium">User sends:</span> {keyword || 'KEYWORD'}</p>
                            <p><span className="font-medium">System action:</span> {action === 'opt_out' ? 'Unsubscribe user' : 'Subscribe user'}</p>
                            <p><span className="font-medium">Auto reply:</span> {replyText || 'Your reply message will appear here'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
