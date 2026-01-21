import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { auth } from '@/lib/supabase';
import { getUserProfile, UserProfile, SubscriptionTier } from '@/lib/subscription';

interface AuthContextType {
    user: User | null;
    isEmailVerified: boolean;
    session: Session | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUserProfile = async (userId: string) => {
        const userProfile = await getUserProfile(userId);
        setProfile(userProfile);
    };

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                const { session } = await auth.getSession();
                if (mounted) {
                    setSession(session);
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        await loadUserProfile(session.user.id);
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        // Failsafe: Force loading to false after 2 seconds to prevent blocking UI
        const timeoutId = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 2000);

        // Listen for auth changes
        const { data: { subscription } } = auth.onAuthStateChange(async (_event, session) => {
            try {
                if (mounted) {
                    setSession(session);
                    setUser(session?.user ?? null);

                    if (session?.user) {
                        await loadUserProfile(session.user.id);
                    } else {
                        setProfile(null);
                    }
                }
            } catch (error) {
                console.error('Auth state change error:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { data, error } = await auth.signIn(email, password);
        if (data.user) {
            setUser(data.user);
            setSession(data.session);
            await loadUserProfile(data.user.id);
        }
        return { error };
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await auth.signUp(email, password);
        if (data.user) {
            // Only set user/session if it's a real new session or user (careful with fake success)
            if (data.user.identities && data.user.identities.length > 0) {
                setUser(data.user);
                setSession(data.session);
                // Profile will be created automatically by trigger
                setTimeout(() => {
                    loadUserProfile(data.user!.id);
                }, 1000);
            }
        }
        return { data, error };
    };

    const signOut = async () => {
        try {
            // Attempt to sign out from Supabase with a timeout to prevent hanging
            await Promise.race([
                auth.signOut(),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            // Manually clear localStorage to ensure session is gone
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') || key.startsWith('user_profile_')) {
                    localStorage.removeItem(key);
                }
            });

            setUser(null);
            setSession(null);
            setProfile(null);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await loadUserProfile(user.id);
        }
    };

    const isEmailVerified = !!(user?.email_confirmed_at || user?.confirmed_at || user?.app_metadata?.provider === 'google'); // Google accounts are implicitly verified

    return (
        <AuthContext.Provider value={{ user, isEmailVerified, session, profile, loading, signIn, signUp, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
