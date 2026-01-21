import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Trophy, AlertTriangle, Smile } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseWhatsAppChat, calculateStats, ChatStats } from '@/lib/chatParser';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ComparisonStat {
    id: string;
    name: string;
    count: number;
    funniest: number;
    toxicity: number; // Percentage
}

export function GroupComparison() {
    const [comparisons, setComparisons] = useState<ComparisonStat[]>([]);
    const [metric, setMetric] = useState<'activity' | 'funny' | 'toxic'>('activity');

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        for (const file of acceptedFiles) {
            const text = await file.text();
            const msgs = parseWhatsAppChat(text);
            if (msgs.length > 0) {
                const stats = calculateStats(msgs);

                // Calculate Metrics
                // Funny: count of 'lol', 'haha', '😂'
                let funnyCount = 0;
                let toxicCount = 0;

                msgs.forEach(m => {
                    const content = m.content.toLowerCase();
                    if (content.includes('lol') || content.includes('haha') || content.includes('😂')) funnyCount++;
                    // Toxicity approximation (simple check, ideally utilize sentiment score < -2)
                    // Since we don't store individual sentiment in stats for all msgs unless we re-run it.
                    // calculateStats DOES run sentiment. 
                    // But stats.advanced.sentiment.overall is aggregate.
                    // let's use the 'overall' sentiment as inverse proxy? 
                    // No, let's just count 'bad words'? 
                    // Actually, stats.advanced.sentiment.overall is available.
                    // Negative overall = toxic.
                });

                // Use Overall Sentiment for Toxicity (Inverse)
                // If Sentiment < 0, Toxicity is high.
                // Map -5 to 100%, +5 to 0%.
                // Score: -2 -> 70% toxic. 0 -> 50%. 2 -> 30%.
                const sentiment = stats.advanced.sentiment.overall;
                const toxicity = Math.max(0, Math.min(100, 50 - (sentiment * 10)));

                setComparisons(prev => [
                    ...prev,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        name: file.name.replace('.txt', '').replace('WhatsApp Chat with ', ''),
                        count: stats.totalMessages,
                        funniest: funnyCount,
                        toxicity: Math.round(toxicity)
                    }
                ]);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.txt'] }
    });

    const sortedData = [...comparisons].sort((a, b) => {
        if (metric === 'activity') return b.count - a.count;
        if (metric === 'funny') return b.funniest - a.funniest;
        return b.toxicity - a.toxicity;
    });

    const getMetricData = (item: ComparisonStat) => {
        if (metric === 'activity') return item.count;
        if (metric === 'funny') return item.funniest;
        return item.toxicity;
    };

    const getMetricLabel = () => {
        if (metric === 'activity') return 'Messages';
        if (metric === 'funny') return 'Laughs';
        return 'Toxic Score';
    };

    const getBarColor = (index: number) => {
        if (index === 0) return '#eab308'; // Gold
        if (index === 1) return '#94a3b8'; // Silver
        if (index === 2) return '#b45309'; // Bronze
        return '#10b981'; // Primary
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Social Circle Leaderboard
                </CardTitle>
                <CardDescription>Compare multiple chats to see which group wins</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Controls */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={metric === 'activity' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMetric('activity')}
                    >
                        Most Active
                    </Button>
                    <Button
                        variant={metric === 'funny' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMetric('funny')}
                    >
                        <Smile className="w-4 h-4 mr-2" />
                        Funniest
                    </Button>
                    <Button
                        variant={metric === 'toxic' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMetric('toxic')}
                    >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Most Toxic
                    </Button>
                </div>

                {/* Chart */}
                {comparisons.length > 0 ? (
                    <div className="h-[300px] w-full mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={sortedData} margin={{ left: 0, right: 30 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey={(item) => getMetricData(item)} name={getMetricLabel()} radius={[0, 4, 4, 0]} barSize={30}>
                                    {sortedData.map((entry, index) => (
                                        <Cell key={entry.id} fill={metric === 'toxic' ? '#ef4444' : getBarColor(index)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center text-muted-foreground bg-secondary/20 rounded-xl mb-6">
                        Upload chats to start comparing
                    </div>
                )}

                {/* Upload Zone */}
                <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Drop more chat files here to add to the leaderboard</p>
                </div>

                {/* List */}
                <div className="mt-6 space-y-2">
                    {comparisons.map(c => (
                        <div key={c.id} className="flex justify-between items-center text-sm p-2 bg-secondary/30 rounded-lg">
                            <span>{c.name}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setComparisons(prev => prev.filter(x => x.id !== c.id))}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
