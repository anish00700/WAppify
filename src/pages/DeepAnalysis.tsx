
import { motion } from 'framer-motion';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { hasFeatureAccess } from '@/lib/subscription';
import { UnlockModal } from '@/components/dashboard/UnlockModal';
import { useState, useMemo } from 'react';
import { Lock, TrendingUp, Users, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GroupComparison } from '@/components/analysis/GroupComparison';
import { DigitalBookPreview } from '@/components/analysis/DigitalBookPreview';
import { HealthTrendChart } from '@/components/analysis/HealthTrendChart';
import { BehaviorCard } from '@/components/analysis/BehaviorCard';
import { calculateHealthTrend, detectBehaviors } from '@/lib/advancedAnalytics';
import { Card, CardContent } from '@/components/ui/card';

export default function DeepAnalysis() {
  const { messages, stats } = useChat();
  const { profile, refreshProfile } = useAuth();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'sentiment' | 'reply-time' | 'export-pdf' | 'unlimited-chats' | 'word-cloud' | null>(null);
  const [showBook, setShowBook] = useState(false);

  // Advanced Analytics Calculations
  const healthTrend = useMemo(() => messages ? calculateHealthTrend(messages) : [], [messages]);
  const behaviors = useMemo(() =>
    (messages && stats) ? detectBehaviors(messages, Object.keys(stats.participants || {})) : {},
    [messages, stats]);

  const handleFeatureClick = (feature: 'sentiment' | 'reply-time' | 'export-pdf' | 'unlimited-chats' | 'word-cloud') => {
    if (!hasFeatureAccess(profile, feature)) {
      setActiveFeature(feature);
      setShowUnlockModal(true);
    }
  };

  const isUnlocked = (feature: 'sentiment' | 'reply-time' | 'export-pdf' | 'unlimited-chats' | 'word-cloud') =>
    hasFeatureAccess(profile, feature);

  if (!messages || !messages.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="p-6 bg-indigo-50 rounded-3xl">
          <BookOpen className="w-12 h-12 text-indigo-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">No Chat Analyzed Yet</h2>
          <p className="text-gray-500 max-w-md">
            Please upload a WhatsApp chat export from the Dashboard to see deep psychological insights and behavioral profiling.
          </p>
        </div>
        <Button onClick={() => window.location.href = '/dashboard'} className="gap-2 shadow-lg">
          <Sparkles className="w-4 h-4" />
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Deep Analysis</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Uncover hidden patterns and psychological insights from your conversations.
        </p>
      </motion.div>

      {/* 1. Relationship Health Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group"
      >
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
          {/* Header - Always Visible */}
          <div className="flex items-center justify-between mb-8 relative z-20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Relationship Health</h2>
                <p className="text-gray-500 text-sm">Sentiment & Engagement over time</p>
              </div>
            </div>
            {!isUnlocked('sentiment') && <Lock className="w-5 h-5 text-gray-400" />}
          </div>

          {/* Content - Blurred if locked */}
          <div className={`transition-all duration-500 ${!isUnlocked('sentiment') ? 'blur-md opacity-50 select-none pointer-events-none' : ''}`}>
            <HealthTrendChart data={healthTrend} />
          </div>

          {/* Unlock Overlay */}
          {!isUnlocked('sentiment') && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
              <div className="text-center p-6 bg-white shadow-xl rounded-2xl border border-gray-100 max-w-sm mt-12">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Unlock Health Trends</h3>
                <p className="text-sm text-gray-500 mb-6">Visualise how your relationship sentiment has changed over time.</p>
                <Button onClick={() => handleFeatureClick('sentiment')} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Unlock Analysis
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. Behavior Profiling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[300px] overflow-hidden relative">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 relative z-20">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Behavioral Profiling</h2>
              <p className="text-gray-500 text-sm">AI-driven personality insights</p>
            </div>
            {!isUnlocked('reply-time') && <Lock className="w-5 h-5 text-gray-400 ml-auto" />}
          </div>

          {/* Content */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${!isUnlocked('reply-time') ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
            {(Object.keys(behaviors).length > 0 ? Object.keys(behaviors) : ['User 1', 'User 2']).map((participant, idx) => (
              <div key={participant} className="h-full min-h-[200px]">
                {Object.keys(behaviors).length > 0 ? (
                  <BehaviorCard participant={participant} badges={behaviors[participant]} />
                ) : (
                  // Placeholder for when no data is loaded/available yet but we want to show layout
                  <div className="h-full bg-gray-50 rounded-2xl border border-dashed border-gray-200"></div>
                )}
              </div>
            ))}
          </div>

          {/* Unlock Overlay */}
          {!isUnlocked('reply-time') && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
              <div className="text-center p-6 bg-white shadow-xl rounded-2xl border border-gray-100 max-w-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Unlock Profiles</h3>
                <p className="text-sm text-gray-500 mb-4">See who is the "Ghost", "Simp" or "Night Owl"</p>
                <Button onClick={() => handleFeatureClick('reply-time')} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  View Behavioral Traits
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 3. Digital Book */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden border-none shadow-sm">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-2xl font-bold font-serif flex items-center gap-2 text-gray-900">
                <BookOpen className="w-6 h-6 text-primary" />
                Your Digital Storybook
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Transform your chat history into a beautifully formatted novel. Perfect for printing as a gift or saving as a permanent keepsake.
                Optimized for A4/Letter size printing.
              </p>

              {isUnlocked('export-pdf') ? (
                <Button onClick={() => setShowBook(true)} size="lg" className="w-full sm:w-auto shadow-lg bg-gray-900 text-white hover:bg-gray-800">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Open Book Reader
                </Button>
              ) : (
                <Button onClick={() => handleFeatureClick('export-pdf')} variant="secondary" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-50 border border-gray-200">
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock Digital Book
                </Button>
              )}
            </div>

            {/* Visual Preview */}
            <div className="relative w-48 h-60 bg-white rounded-r-lg shadow-2xl border-l-[12px] border-primary/80 transform rotate-3 hover:rotate-0 transition-transform duration-500 hidden sm:block">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="font-serif font-bold text-gray-800 text-lg line-clamp-2">The Story of Us</h3>
                <div className="w-8 h-8 rounded-full bg-primary/10 mt-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 4. Cross-Chat Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GroupComparison />
      </motion.div>

      {/* Modals */}
      <UnlockModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        feature={activeFeature || ''}
      />

      {showBook && (
        <DigitalBookPreview
          messages={messages}
          title="Chat History"
          onClose={() => setShowBook(false)}
        />
      )}
    </div>
  );
}
