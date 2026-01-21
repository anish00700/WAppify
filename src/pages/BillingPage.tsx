import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Crown, Check, Receipt, Shield, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { processPayment, SubscriptionTier } from '@/lib/subscription';
import { useToast } from '@/hooks/use-toast';

const planFeatures = {
  free: ['Basic Stats', 'Busiest Day Analysis', 'Top 3 Emojis'],
  'one-time': [
    'Full "Wrapped" PDF Export',
    'High-Res Shareable Images',
    'Deep Dive Analytics',
    'Word Cloud Visualization',
  ],
  pro: [
    'Unlimited Chat Analysis',
    '1-Year History Tracking',
    'Sentiment Trends',
    'Reply-Time Metrics',
    'Priority Support',
  ],
};

const planPrices = {
  free: { amount: 0, period: 'forever' },
  'one-time': { amount: 4.99, period: 'one-time' },
  pro: { amount: 14.99, period: 'year' },
};

export default function BillingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [upgrading, setUpgrading] = useState<SubscriptionTier | null>(null);

  const currentTier = profile?.subscription_tier || 'free';

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to upgrade your plan",
        variant: "destructive",
      });
      return;
    }

    setUpgrading(tier);

    try {
      const price = planPrices[tier].amount;
      const { success, error } = await processPayment(user.id, tier, price);

      if (success) {
        await refreshProfile();
        toast({
          title: "Upgrade successful!",
          description: `You're now on the ${tier === 'one-time' ? 'One-Time Report' : 'Pro'} plan.`,
        });
      } else {
        toast({
          title: "Upgrade failed",
          description: error || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpgrading(null);
    }
  };

  const renderPlanCard = (tier: SubscriptionTier, index: number) => {
    const isActive = currentTier === tier;
    const canUpgrade = (tier === 'one-time' && currentTier === 'free') ||
      (tier === 'pro' && ['free', 'one-time'].includes(currentTier));
    const price = planPrices[tier];
    const features = planFeatures[tier];
    const isUpgrading = upgrading === tier;

    const tierNames = {
      free: 'Free',
      'one-time': 'One-Time Report',
      pro: 'Pro Access',
    };

    const tierIcons = {
      free: CreditCard,
      'one-time': Sparkles,
      pro: Crown,
    };

    const Icon = tierIcons[tier];

    return (
      <motion.div
        key={tier}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + index * 0.1 }}
      >
        <Card className={`h-full relative ${tier === 'pro'
          ? 'border-2 border-primary/30 bg-gradient-to-br from-emerald-50/50 to-white'
          : isActive
            ? 'border-2 border-primary'
            : ''
          }`}>
          {tier === 'pro' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md">
                BEST VALUE
              </span>
            </div>
          )}

          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                {tierNames[tier]}
              </CardTitle>
              {isActive && (
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  Active
                </span>
              )}
            </div>
            <CardDescription>
              {isActive ? 'Your current plan' : tierNames[tier]}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="mb-4">
              <span className="text-3xl font-bold text-foreground">
                ${price.amount.toFixed(2)}
              </span>
              <span className="text-muted-foreground">/ {price.period}</span>
            </div>

            <ul className="space-y-2 mb-6">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier === 'pro'
                    ? 'bg-primary'
                    : tier === 'free'
                      ? 'bg-secondary'
                      : 'bg-primary/20'
                    }`}>
                    <Check className={`w-3 h-3 ${tier === 'pro' ? 'text-primary-foreground' : 'text-primary'
                      }`} />
                  </div>
                  <span className={tier === 'free' ? 'text-muted-foreground' : 'text-foreground'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {canUpgrade && !isActive && (
              <Button
                variant={tier === 'pro' ? 'hero' : 'outline'}
                size="lg"
                className="w-full"
                onClick={() => handleUpgrade(tier)}
                disabled={isUpgrading}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  `Upgrade for $${price.amount.toFixed(2)}`
                )}
              </Button>
            )}

            {isActive && tier !== 'free' && (
              <p className="text-center text-xs text-muted-foreground">
                {profile?.subscription_expires_at
                  ? `Expires ${new Date(profile.subscription_expires_at).toLocaleDateString()}`
                  : 'Active'}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          Billing & Subscription
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          {currentTier === 'free'
            ? 'Upgrade to unlock premium features'
            : `You're currently on the ${currentTier === 'one-time' ? 'One-Time Report' : 'Pro'} plan`}
        </motion.p>
      </div>

      {/* All Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
        {renderPlanCard('free', 0)}
        {renderPlanCard('one-time', 1)}
        {renderPlanCard('pro', 2)}
      </div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-6xl"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              Payment History
            </CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">No transactions yet</p>
              <p className="text-sm text-muted-foreground">
                Your payment history will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy & Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-6xl"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy & Data
            </CardTitle>
            <CardDescription>How we handle your information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-secondary/30">
                <h4 className="font-medium text-foreground mb-1">Client-Side Processing</h4>
                <p className="text-sm text-muted-foreground">
                  All chat analysis happens in your browser. Data never leaves your device.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30">
                <h4 className="font-medium text-foreground mb-1">No Data Storage</h4>
                <p className="text-sm text-muted-foreground">
                  We don't store your chats. Close the tab and your data is gone.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30">
                <h4 className="font-medium text-foreground mb-1">Open Source</h4>
                <p className="text-sm text-muted-foreground">
                  Our analysis engine is open source. Verify our privacy claims yourself.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
