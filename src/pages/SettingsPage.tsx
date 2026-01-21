import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useChat } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { stats, clearChat } = useChat();
  const navigate = useNavigate();

  const handleClearData = () => {
    clearChat();
    navigate('/');
  };

  return (
    <div className="space-y-8">
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          Settings
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Manage your session and preferences
        </motion.p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-primary" />
                Current Session
              </CardTitle>
              <CardDescription>
                Information about your current analysis session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Messages Analyzed</span>
                  <p className="font-semibold text-foreground">{stats?.totalMessages.toLocaleString() || 0}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Participants</span>
                  <p className="font-semibold text-foreground">{stats?.participants.length || 0}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Chat Duration</span>
                  <p className="font-semibold text-foreground">{stats?.chatDuration || 0} days</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Words</span>
                  <p className="font-semibold text-foreground">{stats?.totalWords.toLocaleString() || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                Clear Data
              </CardTitle>
              <CardDescription>
                Remove all analyzed data from this session. This cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleClearData}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
