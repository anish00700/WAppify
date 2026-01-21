import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Sparkles, Crown, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { processPayment, SubscriptionTier } from '@/lib/subscription';
import { useToast } from '@/hooks/use-toast';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export function UnlockModal({ isOpen, onClose, feature }: UnlockModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'one-time' | 'pro'>('pro');
  const [processing, setProcessing] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to upgrade",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const price = selectedPlan === 'pro' ? 14.99 : 4.99;
      const { success, error } = await processPayment(user.id, selectedPlan, price);

      if (success) {
        await refreshProfile();
        toast({
          title: "Success!",
          description: `You've upgraded to ${selectedPlan === 'pro' ? 'Pro Access' : 'One-Time Report'}`,
        });
        onClose();
      } else {
        toast({
          title: "Payment failed",
          description: error || "Please try again",
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
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container - Centered */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg pointer-events-auto"
            >
              <div className="bg-card rounded-3xl shadow-2xl shadow-black/25 overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-primary/10 via-secondary to-accent p-6 text-center">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>

                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Unlock {feature}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Get access to premium insights and detailed analytics
                  </p>
                </div>

                {/* Plans */}
                <div className="p-6 space-y-4">
                  {/* One-Time Option */}
                  <button
                    onClick={() => setSelectedPlan('one-time')}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 text-left transition-all",
                      selectedPlan === 'one-time'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">One-Time Report</span>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        selectedPlan === 'one-time'
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}>
                        {selectedPlan === 'one-time' && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-2xl font-bold text-foreground">$4.99</span>
                      <span className="text-sm text-muted-foreground">one-time</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Full analysis for this chat only</p>
                  </button>

                  {/* Pro Option */}
                  <button
                    onClick={() => setSelectedPlan('pro')}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 text-left transition-all relative visible", // Removed overflow-hidden
                      selectedPlan === 'pro'
                        ? "border-primary bg-gradient-to-br from-primary/10 to-emerald-50"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-md">
                        BEST VALUE
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">Pro Access</span>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        selectedPlan === 'pro'
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}>
                        {selectedPlan === 'pro' && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-2xl font-bold text-foreground">$14.99</span>
                      <span className="text-sm text-muted-foreground">/ year</span>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-primary" />
                        <span>Relationship Stock Market 📈</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-primary" />
                        <span>Behavioral Profiling (Ghost/Simp Detector) 👻</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-primary" />
                        <span>Social Circle Leaderboards 🏆</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-primary" />
                        <span>Digital Book Export 📖</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-primary" />
                        <span>Unlimited Chat History & Storage ☁️</span>
                      </div>
                    </div>
                  </button>

                  {/* CTA */}
                  <Button
                    variant="hero"
                    size="xl"
                    className="w-full group"
                    onClick={handleUpgrade}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {selectedPlan === 'pro' ? 'Upgrade to Pro' : 'Buy Report'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Secure payment • Instant access • Cancel anytime
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
