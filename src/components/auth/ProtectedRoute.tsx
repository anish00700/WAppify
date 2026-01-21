import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to signin but save the attempted location
        return <Navigate to="/auth/signin" state={{ from: location }} replace />;
    }

    if (!user.app_metadata?.provider || user.app_metadata.provider === 'email') {
        // Check if email is verified for email/password users
        // (Social logins usually come verified, but safe to check flag in context too)
        const isVerified = !!(user.email_confirmed_at || user.confirmed_at);
        if (!isVerified) {
            return <Navigate to="/auth/verify-email" replace />;
        }
    }

    return <>{children}</>;
}
