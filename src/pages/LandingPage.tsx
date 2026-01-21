import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Sparkles, User, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { FeatureCard } from '@/components/landing/FeatureCard';
import { PrivacyBadge } from '@/components/landing/PrivacyBadge';
import { DemoChart } from '@/components/landing/DemoChart';
import { PricingSection } from '@/components/landing/PricingSection';
import { ExportInstructions } from '@/components/landing/ExportInstructions';
import { useAuth } from '@/context/AuthContext';
import { Shield, BarChart3, Eye, Lock, Zap } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your chats never leave your device. All processing happens locally in your browser using WebAssembly.',
  },
  {
    icon: BarChart3,
    title: 'Beautiful Insights',
    description: 'Get stunning visualizations of your chat patterns, activity trends, and conversation dynamics.',
  },
  {
    icon: Eye,
    title: 'Deep Analysis',
    description: 'Discover who messages most, busiest hours, emoji usage, and more hidden patterns.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'No waiting for server processing. Get your personalized "Wrapped" in seconds.',
  },
];

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">WAppify</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <PrivacyBadge variant="compact" />
            {loading ? (
              <div className="w-24 h-9 rounded-md bg-secondary animate-pulse" />
            ) : user ? (
              <Link to="/dashboard">
                <Button variant="default" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth/signin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Your Conversations, Beautifully Analyzed
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
          >
            Unlock Insights from Your
            <span className="text-gradient"> WhatsApp Chats</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Transform your chat exports into stunning visual stories. See who messages most,
            discover your busiest hours, and relive your conversations—all processed
            privately on your device.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            {user ? (
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="group">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth/signup">
                <Button variant="hero" size="xl" className="group">
                  Start Analyzing for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              No credit card required • 100% Free plan available
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <PrivacyBadge />
          </motion.div>
        </div>
      </section>

      {/* Export Instructions Section */}
      <ExportInstructions />

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose WAppify?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with privacy at its core, delivering beautiful insights without compromising your data.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              See What You'll Get
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beautiful, interactive charts that bring your conversations to life.
            </p>
          </motion.div>

          <DemoChart />
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary to-accent p-12 text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm text-foreground text-sm font-medium mb-6">
                <Lock className="w-4 h-4 text-primary" />
                Zero data leaves your browser
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Explore Your Chats?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Upload your WhatsApp export and discover insights in seconds.
                100% private, 100% local.
              </p>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="hero" size="xl" className="group">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth/signup">
                  <Button variant="hero" size="xl" className="group">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">WAppify</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 WAppify. Privacy-first chat analytics.
          </p>
        </div>
      </footer>
    </div>
  );
}
