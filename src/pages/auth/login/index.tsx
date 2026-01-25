import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

// Development credentials for quick testing
const DEV_CREDENTIALS = {
    brand: {
        email: 'brand@example.com',
        password: 'password123',
        label: 'Brand Admin'
    },
    agency: {
        email: 'agency@example.com',
        password: 'password123',
        label: 'Agency Admin'
    },
    owner: {
        email: 'owner@example.com',
        password: 'password123',
        label: 'Owner Admin'
    }
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAdminType, setSelectedAdminType] = useState<'brand' | 'agency' | 'owner'>('brand');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Auto-fill credentials when admin type changes
    useEffect(() => {
        const credentials = DEV_CREDENTIALS[selectedAdminType];
        setEmail(credentials.email);
        setPassword(credentials.password);
    }, [selectedAdminType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password, rememberMe);
            navigate('/');
        } finally {
            setIsLoading(false);
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
                    <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
                    <p className="text-muted-foreground mt-1">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-4">
                    {/* Quick Select Admin Type - Development Only */}
                    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Quick Select (Dev Mode)
                        </Label>
                        <RadioGroup value={selectedAdminType} onValueChange={(value) => setSelectedAdminType(value as 'brand' | 'agency' | 'owner')}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="brand" id="brand" />
                                <Label htmlFor="brand" className="cursor-pointer font-normal">
                                    {DEV_CREDENTIALS.brand.label}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="agency" id="agency" />
                                <Label htmlFor="agency" className="cursor-pointer font-normal">
                                    {DEV_CREDENTIALS.agency.label}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="owner" id="owner" />
                                <Label htmlFor="owner" className="cursor-pointer font-normal">
                                    {DEV_CREDENTIALS.owner.label}
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

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

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded border-input"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
