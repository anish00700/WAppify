import { Shield, Lock, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyBadgeProps {
  variant?: 'default' | 'compact' | 'inline';
}

export function PrivacyBadge({ variant = 'default' }: PrivacyBadgeProps) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Processed on Device</span>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
        <Lock className="w-4 h-4 text-primary" />
        <span>Your chats never leave your device</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-start sm:items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
        <Shield className="w-6 h-6 text-emerald-600" />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-base font-bold text-gray-900">100% Client-Side Processing</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/50 text-xs font-semibold text-emerald-700 border border-emerald-200/50">
            <Laptop className="w-3 h-3" />
            <span>Local</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Your data is processed entirely in your browser. No uploads, no servers, no tracking.
        </p>
      </div>
    </motion.div>
  );
}
