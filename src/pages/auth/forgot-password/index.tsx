import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center text-white mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">Check your email</h1>
                        <p className="text-muted-foreground mt-2">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                    </div>

                    <Alert>
                        <AlertDescription>
                            Didn't receive the email? Check your spam folder or{' '}
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-primary hover:underline font-medium"
                            >
                                try again
                            </button>
                        </AlertDescription>
                    </Alert>

                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-6"
                    >
                        <ArrowLeft size={16} />
                        Back to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto mb-4">
                        AP
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground">Forgot password?</h1>
                    <p className="text-muted-foreground mt-2">
                        No worries, we'll send you reset instructions
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send reset link'}
                    </Button>
                </form>

                {/* Footer */}
                <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-6"
                >
                    <ArrowLeft size={16} />
                    Back to login
                </Link>
            </div>
        </div>
    );
}
