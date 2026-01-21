import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  variant: 'free' | 'one-time' | 'pro';
}

const tiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'Forever',
    description: 'Get started with basic insights',
    features: [
      'Basic Stats (Messages, Words)',
      'Busiest Day Analysis',
      'Top 3 Emojis',
      'Single Chat Analysis',
      'Local Processing',
    ],
    cta: 'Try for Free',
    variant: 'free',
  },
  {
    name: 'One-Time Report',
    price: '$4.99',
    period: 'One-time',
    description: 'Full analysis for a single chat',
    features: [
      'Everything in Free',
      'Full "Wrapped" PDF Export',
      'High-Res Shareable Images',
      'Deep Dive Analytics',
      'Word Cloud Visualization',
    ],
    cta: 'Buy Report',
    variant: 'one-time',
  },
  {
    name: 'Pro Access',
    price: '$14.99',
    period: 'per year',
    description: 'Unlimited insights & advanced features',
    features: [
      'Everything in One-Time',
      'Unlimited Chat Analysis',
      '1-Year History Tracking',
      'Sentiment Trends',
      'Reply-Time Metrics',
      'Priority Support',
    ],
    cta: 'Go Pro',
    popular: true,
    variant: 'pro',
  },
];

interface PricingCardProps {
  tier: PricingTier;
  delay?: number;
  onSelect: (variant: string) => void;
}

function PricingCard({ tier, delay = 0, onSelect }: PricingCardProps) {
  const isPro = tier.variant === 'pro';
  const isOneTime = tier.variant === 'one-time';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative"
    >
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/25">
            <Sparkles className="w-3.5 h-3.5" />
            Most Popular
          </span>
        </div>
      )}

      <Card
        className={cn(
          "h-full transition-all duration-300 hover:-translate-y-2 flex flex-col",
          isPro && "border-2 border-primary shadow-xl shadow-primary/10 bg-gradient-to-b from-emerald-50/50 to-white",
          isOneTime && "border-2 border-primary/30",
          !isPro && !isOneTime && "border"
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            {tier.variant === 'free' && <Zap className="w-5 h-5 text-muted-foreground" />}
            {tier.variant === 'one-time' && <Sparkles className="w-5 h-5 text-primary" />}
            {tier.variant === 'pro' && <Crown className="w-5 h-5 text-primary" />}
            <h3 className="font-semibold text-lg text-foreground">{tier.name}</h3>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">{tier.price}</span>
            <span className="text-muted-foreground">/ {tier.period}</span>
          </div>

          <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          <ul className="space-y-3 mb-6 flex-1">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  isPro ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                )}>
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            variant={isPro ? "hero" : isOneTime ? "default" : "outline"}
            size="lg"
            className="w-full"
            onClick={() => onSelect(tier.variant)}
          >
            {tier.cta}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PricingSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePricingClick = (variant: string) => {
    if (user) {
      if (variant === 'free') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard/billing');
      }
    } else {
      navigate('/auth/signup');
    }
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            <Crown className="w-4 h-4" />
            Simple, Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more. All plans include our privacy-first,
            client-side processing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, index) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              delay={index * 0.1}
              onSelect={handlePricingClick}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          All plans include 100% client-side processing. Your data never leaves your device.
        </motion.p>
      </div>
    </section>
  );
}
