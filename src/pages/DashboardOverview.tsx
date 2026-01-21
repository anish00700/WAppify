import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Calendar,
  Clock,
  Hash,
  Smile,
  Lock,
  Sparkles,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { hasFeatureAccess } from '@/lib/subscription';
import { formatNumber, formatHour, calculateStats } from '@/lib/chatParser';
import { generatePDF } from '@/lib/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { ActivityChart } from '@/components/dashboard/charts/ActivityChart';
import { HourlyChart } from '@/components/dashboard/charts/HourlyChart';
import { ParticipantChart } from '@/components/dashboard/charts/ParticipantChart';
import { WordCloudChart } from '@/components/dashboard/charts/WordCloudChart';
import { UnlockModal } from '@/components/dashboard/UnlockModal';
import { FileUploadZone } from '@/components/landing/FileUploadZone';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, subtext, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card variant="stat" className="h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
              {subtext && (
                <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface LockedCardProps {
  title: string;
  description: string;
  onUnlock: () => void;
}

function LockedCard({ title, description, onUnlock }: LockedCardProps) {
  return (
    <Card className="relative overflow-hidden group cursor-pointer" onClick={onUnlock}>
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 to-muted/80 backdrop-blur-sm z-10 flex items-center justify-center transition-all group-hover:from-secondary/70 group-hover:to-muted/70">
        <div className="text-center p-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <p className="font-semibold text-foreground mb-1">{title}</p>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <Button variant="hero" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Unlock Feature
          </Button>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">Premium Feature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52 bg-muted rounded-xl" />
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview() {
  const { profile } = useAuth();
  const { messages, stats, selectedParticipant, setSelectedParticipant } = useChat();
  const { toast } = useToast();
  const [unlockModal, setUnlockModal] = useState<{ isOpen: boolean; feature: string }>({
    isOpen: false,
    feature: '',
  });

  const hasWordCloud = hasFeatureAccess(profile, 'word-cloud');

  // Filter messages and recalculate stats when a participant is selected
  const filteredStats = useMemo(() => {
    if (!selectedParticipant || !messages) {
      return stats;
    }

    // Filter messages to only include selected participant
    const filteredMessages = messages.filter(msg => msg.sender === selectedParticipant);

    // Recalculate stats for filtered messages
    return calculateStats(filteredMessages);
  }, [selectedParticipant, messages, stats]);

  const handleExport = async () => {
    if (!hasFeatureAccess(profile, 'export-pdf')) {
      setUnlockModal({ isOpen: true, feature: 'PDF Export' });
      return;
    }

    toast({ title: "Generating PDF...", description: "Please wait while we prepare your report." });

    // Yield to UI to render toast
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate
    const success = await generatePDF('dashboard-report', `wappify-report-${new Date().toISOString().split('T')[0]}.pdf`);

    if (success) {
      toast({ title: "Export Complete", description: "Your PDF report has been downloaded." });
    } else {
      toast({ title: "Export Failed", description: "Something went wrong during generation.", variant: "destructive" });
    }
  };

  if (!stats || !filteredStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">Analyze Your Chat</h2>
          <p className="text-muted-foreground">
            Upload your WhatsApp chat export to get started. All analysis happens privately on your device.
          </p>
        </motion.div>
        <div className="w-full max-w-xl">
          <FileUploadZone />
        </div>
      </div>
    );
  }

  const busiestDayFormatted = filteredStats.busiestDay.date
    ? new Date(filteredStats.busiestDay.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    : 'N/A';

  return (
    <div id="dashboard-report" className="space-y-8 bg-background p-1"> {/* Added ID and bg for PDF capture context */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-foreground"
          >
            Chat Overview
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {selectedParticipant ? `Showing data for ${selectedParticipant}` : `${filteredStats.chatDuration} days of conversation analyzed`}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>

          <Select
            value={selectedParticipant || 'all'}
            onValueChange={(value) => setSelectedParticipant(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by participant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Participants</SelectItem>
              {stats.participants.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MessageSquare}
          label="Total Messages"
          value={formatNumber(filteredStats.totalMessages)}
          subtext={selectedParticipant ? `By ${selectedParticipant}` : `${stats.participants.length} participants`}
          delay={0}
        />
        <StatCard
          icon={Hash}
          label="Total Words"
          value={formatNumber(filteredStats.totalWords)}
          subtext={`~${Math.round(filteredStats.averageMessageLength)} per message`}
          delay={0.1}
        />
        <StatCard
          icon={Calendar}
          label="Busiest Day"
          value={busiestDayFormatted}
          subtext={`${filteredStats.busiestDay.count} messages`}
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          label="Peak Hour"
          value={formatHour(filteredStats.busiestHour)}
          subtext="Most active time"
          delay={0.3}
        />
      </div>

      {/* Top Emojis */}
      {filteredStats.topEmojis.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smile className="w-5 h-5 text-primary" />
                Top Emojis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {filteredStats.topEmojis.slice(0, 8).map((emoji, index) => (
                  <motion.div
                    key={emoji.emoji}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary"
                  >
                    <span className="text-2xl">{emoji.emoji}</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {formatNumber(emoji.count)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ActivityChart data={filteredStats.messagesByDate} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <HourlyChart data={filteredStats.messagesByHour} />
        </motion.div>
      </div>

      {/* Participant Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <ParticipantChart data={selectedParticipant ? { [selectedParticipant]: filteredStats.totalMessages } : stats.messagesByParticipant} />
      </motion.div>

      {/* Word Cloud (Premium) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {hasWordCloud ? (
          <WordCloudChart data={stats.advanced?.wordCloud || []} />
        ) : (
          <LockedCard
            title="Word Cloud"
            description="Unlock to visualize conversation topics"
            onUnlock={() => setUnlockModal({ isOpen: true, feature: 'Word Cloud Visualization' })}
          />
        )}
      </motion.div>

      {/* Unlock Modal */}
      <UnlockModal
        isOpen={unlockModal.isOpen}
        onClose={() => setUnlockModal({ isOpen: false, feature: '' })}
        feature={unlockModal.feature}
      />
    </div>
  );
}
