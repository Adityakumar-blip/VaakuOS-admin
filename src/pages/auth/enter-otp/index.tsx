import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function EnterOTP() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || 'your email';
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) return;

        setIsLoading(true);
        try {
            // Verify OTP - Mock verification
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/create-password', { state: { email, otp } });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            // Mock resend
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Show toast or alert here ideally
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto mb-4">
                        AP
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground">Enter OTP</h1>
                    <p className="text-muted-foreground mt-2">
                        We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <div className="space-y-4 flex flex-col items-center">
                        <Label htmlFor="otp" className="sr-only">One-Time Password</Label>
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <p className="text-xs text-muted-foreground text-center">
                            Please enter the verification code sent to your email.
                        </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                        {isLoading ? 'Verifying...' : 'Verify & Continue'}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
                        >
                            {isResending ? (
                                <>
                                    <RefreshCw size={14} className="animate-spin" />
                                    Resending...
                                </>
                            ) : (
                                "Didn't receive code? Resend"
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-6">
                    <Link
                        to="/forgot-password"
                        state={{ email }}
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={16} />
                        Back to email
                    </Link>
                </div>
            </div>
        </div>
    );
}
