import { ChatMessage } from './chatParser';

export interface HealthPoint {
    date: string;
    volume: number;
    sentiment: number;
    score: number;
    trend: 'Bullish' | 'Bearish';
}

export interface BehaviorBadge {
    id: 'ghost' | 'simp' | 'carry' | 'night_owl' | 'early_bird';
    label: string;
    icon: string; // Emoji
    description: string;
    color: string;
}

// 1. Calculate Relationship Health Trend
export const calculateHealthTrend = (messages: ChatMessage[]): HealthPoint[] => {
    if (!messages.length) return [];

    // Group by Month (YYYY-MM)
    const monthlyData: Record<string, { count: number; sentimentSum: number }> = {};

    messages.forEach(msg => {
        // FIX: Use timestamp, not date property
        const date = new Date(msg.timestamp);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[key]) {
            monthlyData[key] = { count: 0, sentimentSum: 0 };
        }

        monthlyData[key].count++;
        // Mock sentiment for now
        const mockSentiment = Math.min(1, Math.max(0, 0.5 + (msg.content.length > 50 ? 0.2 : -0.1) + (Math.random() * 0.4 - 0.2)));
        monthlyData[key].sentimentSum += mockSentiment;
    });

    // Find peak volume for normalization
    const maxVolume = Math.max(...Object.values(monthlyData).map(d => d.count));

    // Sort months
    const months = Object.keys(monthlyData).sort();

    return months.map((month, index) => {
        const data = monthlyData[month];
        const avgSentiment = data.sentimentSum / data.count;
        const normalizedVolume = (data.count / maxVolume) * 100;

        // Health Score Formula: (Volume * 40%) + (Sentiment * 60%)
        const score = Math.round((normalizedVolume * 0.4) + (avgSentiment * 100 * 0.6));

        // Determine Trend (vs previous month)
        let trend: 'Bullish' | 'Bearish' = 'Bullish';
        if (index > 0) {
            const prevScore = (monthlyData[months[index - 1]].count / maxVolume * 40) + ((monthlyData[months[index - 1]].sentimentSum / monthlyData[months[index - 1]].count) * 60);
            if (score < prevScore) trend = 'Bearish';
        }

        return {
            date: month,
            volume: data.count,
            sentiment: Number(avgSentiment.toFixed(2)),
            score,
            trend
        };
    });
};

// 2. Detect User Behaviors
export const detectBehaviors = (messages: ChatMessage[], participants: string[]): Record<string, BehaviorBadge[]> => {
    const behaviors: Record<string, BehaviorBadge[]> = {};

    // Initialize
    participants.forEach(p => behaviors[p] = []);

    if (messages.length === 0) return behaviors;

    // Pre-calculate per-user stats
    const userStats: Record<string, {
        count: number;
        totalChars: number;
        replyTimes: number[];
        nightOwls: number; // 1 AM - 5 AM
        earlyBirds: number; // 5 AM - 9 AM
        doubleTexts: number;
    }> = {};

    participants.forEach(p => {
        userStats[p] = { count: 0, totalChars: 0, replyTimes: [], nightOwls: 0, earlyBirds: 0, doubleTexts: 0 };
    });

    let lastSender = '';

    messages.forEach((msg) => {
        const p = msg.sender;
        if (!userStats[p]) return; // Unknown sender

        userStats[p].count++;
        userStats[p].totalChars += msg.content.length;

        // FIX: Use timestamp property
        const date = new Date(msg.timestamp);
        const hour = date.getHours();

        // Time of day stats
        if (hour >= 1 && hour < 5) userStats[p].nightOwls++;
        if (hour >= 5 && hour < 9) userStats[p].earlyBirds++;

        // Reply time & double text logic would go here
        if (lastSender === p) {
            userStats[p].doubleTexts++;
        }

        lastSender = p;
    });

    // Assign Badges
    participants.forEach(p => {
        const stats = userStats[p];
        if (stats.count === 0) return;

        // 👻 Ghost: < 10% of total messages
        if (stats.count / messages.length < 0.1) {
            behaviors[p].push({
                id: 'ghost',
                label: 'The Ghost',
                icon: '👻',
                description: 'Hardly ever replies. Are they even reading this?',
                color: 'bg-gray-100 text-gray-600 border-gray-200'
            });
        }

        // 🎒 The Carry: > 60% of total messages
        if (stats.count / messages.length > 0.6) {
            behaviors[p].push({
                id: 'carry',
                label: 'The Carry',
                icon: '🎒',
                description: 'Carrying the conversation on their back.',
                color: 'bg-blue-100 text-blue-600 border-blue-200'
            });
        }

        // 🥺 Simp / Eager: High Double Text Ratio (> 30%)
        if (stats.doubleTexts / stats.count > 0.3) {
            behaviors[p].push({
                id: 'simp',
                label: 'Eager Beaver',
                icon: '🥺',
                description: 'Sends multiple messages in a row. A lot.',
                color: 'bg-pink-100 text-pink-600 border-pink-200'
            });
        }

        // 🦉 Night Owl: > 20% messages late at night
        if (stats.nightOwls / stats.count > 0.2) {
            behaviors[p].push({
                id: 'night_owl',
                label: 'Night Owl',
                icon: '🦉',
                description: 'Most active when the world sleeps (1 AM - 5 AM).',
                color: 'bg-purple-100 text-purple-600 border-purple-200'
            });
        }

        // 🌅 Early Bird: > 20% messages early morning
        if (stats.earlyBirds / stats.count > 0.2) {
            behaviors[p].push({
                id: 'early_bird',
                label: 'Early Bird',
                icon: '🌅',
                description: 'Up and texting before breakfast (5 AM - 9 AM).',
                color: 'bg-orange-100 text-orange-600 border-orange-200'
            });
        }
    });

    return behaviors;
};
