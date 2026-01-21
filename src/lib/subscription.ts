import { supabase } from './supabase';

export type SubscriptionTier = 'free' | 'one-time' | 'pro';

export interface UserProfile {
    id: string;
    email: string;
    subscription_tier: SubscriptionTier;
    subscription_expires_at: string | null;
    created_at: string;
    updated_at: string;
}

// Get user's subscription profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    // Check if demo user mock mode is active
    if (localStorage.getItem('is_demo_user') === 'true') {
        return {
            id: userId,
            email: 'demo@wappify.com',
            subscription_tier: 'pro',
            subscription_expires_at: new Date(Date.now() + 31536000000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    }

    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.warn('Error fetching user profile (database may not be set up yet):', error.message);

        // Check localStorage first
        const storedProfile = localStorage.getItem(`user_profile_${userId}`);
        if (storedProfile) {
            console.log('Using cached profile from localStorage');
            return JSON.parse(storedProfile);
        }

        // Fallback: Create a temporary profile if table doesn't exist
        // This allows the app to work before Supabase is fully configured
        const tempProfile: UserProfile = {
            id: userId,
            email: 'temp@example.com', // Will be overwritten when DB is set up
            subscription_tier: 'free',
            subscription_expires_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        console.log('Using temporary profile. Please set up Supabase database for full functionality.');
        return tempProfile;
    }

    return data;
};

// Check if user has access to premium features
export const hasPremiumAccess = (profile: UserProfile | null): boolean => {
    if (!profile) return false;

    // Pro tier always has access
    if (profile.subscription_tier === 'pro') {
        // Check if subscription is expired
        if (profile.subscription_expires_at) {
            const expiresAt = new Date(profile.subscription_expires_at);
            const now = new Date();
            return expiresAt > now;
        }
        return true;
    }

    // One-time tier has access
    if (profile.subscription_tier === 'one-time') {
        return true;
    }

    return false;
};

// Check if user has specific feature access
export const hasFeatureAccess = (
    profile: UserProfile | null,
    feature: 'sentiment' | 'reply-time' | 'export-pdf' | 'unlimited-chats' | 'word-cloud'
): boolean => {
    if (!profile) return false;

    // Map features to required tiers
    const featureRequirements: Record<string, SubscriptionTier[]> = {
        'sentiment': ['one-time', 'pro'],
        'reply-time': ['one-time', 'pro'],
        'export-pdf': ['one-time', 'pro'],
        'unlimited-chats': ['pro'],
        'word-cloud': ['one-time', 'pro'],
    };

    const requiredTiers = featureRequirements[feature] || [];

    if (requiredTiers.includes(profile.subscription_tier)) {
        // For pro tier, check expiration
        if (profile.subscription_tier === 'pro' && profile.subscription_expires_at) {
            const expiresAt = new Date(profile.subscription_expires_at);
            const now = new Date();
            return expiresAt > now;
        }
        return true;
    }

    return false;
};

// Update user's subscription tier
export const updateSubscription = async (
    userId: string,
    tier: SubscriptionTier,
    expiresAt?: string
): Promise<boolean> => {
    const updates: any = {
        subscription_tier: tier,
        updated_at: new Date().toISOString(),
    };

    if (expiresAt) {
        updates.subscription_expires_at = expiresAt;
    }

    const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

    if (error) {
        console.warn('Error updating subscription (using localStorage fallback):', error.message);

        // Fallback: Store in localStorage if database isn't set up
        const profile: UserProfile = {
            id: userId,
            email: 'temp@example.com',
            subscription_tier: tier,
            subscription_expires_at: expiresAt || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        localStorage.setItem(`user_profile_${userId}`, JSON.stringify(profile));
        console.log('Subscription updated in localStorage (temporary)');
        return true;
    }

    return true;
};

// Simulate payment processing (replace with actual payment gateway like PayPal, Lemon Squeezy, etc.)
export const processPayment = async (
    userId: string,
    tier: SubscriptionTier,
    amount: number
): Promise<{ success: boolean; error?: string }> => {
    // This is a placeholder for actual payment processing
    // In production, integrate with PayPal, Lemon Squeezy, etc.

    console.log(`Processing payment for user ${userId}: $${amount} for ${tier} tier`);

    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, always succeed
    let expiresAt: string | undefined;

    if (tier === 'pro') {
        // Pro subscription expires in 1 year
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        expiresAt = expires.toISOString();
    }

    const success = await updateSubscription(userId, tier, expiresAt);

    if (!success) {
        return { success: false, error: 'Failed to update subscription' };
    }

    return { success: true };
};
