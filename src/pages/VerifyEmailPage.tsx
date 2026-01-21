import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, ArrowRight, LogOut, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function VerifyEmailPage() {
    const { user, isEmailVerified, signOut } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isResending, setIsResending] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    // Redirect if already verified
    useEffect(() => {
        if (isEmailVerified) {
            navigate('/dashboard');
        }
    }, [isEmailVerified, navigate]);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/auth/signin');
        }
    }, [user, navigate]);

    const handleResendEmail = async () => {
        if (!user?.email) return;

        setIsResending(true);
        try {
            const { error } = await auth.resend({
                type: 'signup',
                email: user.email,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                }
            });

            if (error) throw error;

            toast({
                title: "Email sent!",
                description: "Check your inbox for the verification link.",
            });
        } catch (error: any) {
            toast({
                title: "Error sending email",
                description: error.message || "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckStatus = async () => {
        setIsChecking(true);
        // Reloading the page is the most detailed way to force a session refresh in some Supabase edge cases,
        // but usually re-fetching the session works.
        window.location.reload();
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 p-8 text-center"
            >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-emerald-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
                <p className="text-gray-500 mb-8">
                    We sent a verification link to <br />
                    <span className="font-semibold text-gray-900">{user.email}</span>
                </p>

                <div className="space-y-3">
                    <Button
                        onClick={handleCheckStatus}
                        className="w-full h-12 text-base gap-2"
                        variant="default"
                        disabled={isChecking}
                    >
                        {isChecking ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-4 h-4" />
                        )}
                        I've verified my email
                    </Button>

                    <Button
                        onClick={handleResendEmail}
                        variant="outline"
                        className="w-full h-12 text-base border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                        disabled={isResending}
                    >
                        {isResending ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            'Resend email'
                        )}
                    </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={() => signOut()}
                        className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto transition-colors"
                    >
                        <LogOut className="w-3 h-3" />
                        Sign out
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
