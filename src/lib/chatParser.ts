import { analyzeSentiment } from './sentiment';
import { stopWords } from './stopWords';

// WhatsApp Chat Parser - Client-side processing
export interface ChatMessage {
  timestamp: Date;
  sender: string;
  content: string;
  isMedia: boolean;
}

export interface ChatStats {
  totalMessages: number;
  totalWords: number;
  participants: string[];
  messagesByParticipant: Record<string, number>;
  wordsByParticipant: Record<string, number>;
  messagesByDate: Record<string, number>;
  messagesByHour: Record<number, number>;
  messagesByDayOfWeek: Record<number, number>;
  topEmojis: { emoji: string; count: number }[];
  averageMessageLength: number;
  busiestDay: { date: string; count: number };
  busiestHour: number;
  firstMessage: Date | null;
  lastMessage: Date | null;
  chatDuration: number; // in days

  // Advanced Stats
  advanced: {
    sentiment: {
      byParticipant: Record<string, number>; // Avg score
      timeline: { date: string; score: number }[];
      overall: number;
    };
    replyTime: {
      byParticipant: Record<string, number>; // Avg in minutes
      overallAverage: number;
    };
    wordCloud: { text: string; value: number }[];
  };
}

// Regex patterns for WhatsApp message formats
const MESSAGE_PATTERNS = [
  // iOS format: [DD/MM/YYYY, HH:MM:SS] Sender: Message
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/,
  // Android format: DD/MM/YYYY, HH:MM - Sender: Message
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?:\s*[AP]M)?)\s*-\s*([^:]+):\s*(.*)$/,
  // Alternative format: DD/MM/YYYY HH:MM - Sender: Message
  /^(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d{1,2}:\d{2}(?:\s*[AP]M)?)\s*-\s*([^:]+):\s*(.*)$/,
];

// Emoji regex
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;

function parseDate(dateStr: string, timeStr: string): Date | null {
  try {
    const dateParts = dateStr.split('/');
    if (dateParts.length !== 3) return null;

    let day = parseInt(dateParts[0]);
    let month = parseInt(dateParts[1]) - 1;
    let year = parseInt(dateParts[2]);

    if (year < 100) year += 2000;

    // Parse time
    let hours = 0;
    let minutes = 0;

    const isPM = timeStr.toLowerCase().includes('pm');
    const isAM = timeStr.toLowerCase().includes('am');
    const timeParts = timeStr.replace(/[^0-9:]/g, '').split(':');

    hours = parseInt(timeParts[0]);
    minutes = parseInt(timeParts[1]) || 0;

    if (isPM && hours !== 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return new Date(year, month, day, hours, minutes);
  } catch {
    return null;
  }
}

export function parseWhatsAppChat(text: string): ChatMessage[] {
  const lines = text.split('\n');
  const messages: ChatMessage[] = [];
  let currentMessage: ChatMessage | null = null;

  for (const line of lines) {
    let matched = false;

    for (const pattern of MESSAGE_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        if (currentMessage) {
          messages.push(currentMessage);
        }

        const [, dateStr, timeStr, sender, content] = match;
        const timestamp = parseDate(dateStr, timeStr);

        if (timestamp) {
          currentMessage = {
            timestamp,
            sender: sender.trim(),
            content: content.trim(),
            isMedia: content.includes('<Media omitted>') ||
              content.includes('image omitted') ||
              content.includes('video omitted') ||
              content.includes('audio omitted'),
          };
          matched = true;
        }
        break;
      }
    }

    // If line doesn't match any pattern, it's a continuation of the previous message
    if (!matched && currentMessage && line.trim()) {
      currentMessage.content += '\n' + line.trim();
    }
  }

  if (currentMessage) {
    messages.push(currentMessage);
  }

  return messages;
}

export function calculateStats(messages: ChatMessage[]): ChatStats {
  if (messages.length === 0) {
    return {
      totalMessages: 0,
      totalWords: 0,
      participants: [],
      messagesByParticipant: {},
      wordsByParticipant: {},
      messagesByDate: {},
      messagesByHour: {},
      messagesByDayOfWeek: {},
      topEmojis: [],
      averageMessageLength: 0,
      busiestDay: { date: '', count: 0 },
      busiestHour: 0,
      firstMessage: null,
      lastMessage: null,
      chatDuration: 0,
      advanced: {
        sentiment: { byParticipant: {}, timeline: [], overall: 0 },
        replyTime: { byParticipant: {}, overallAverage: 0 },
        wordCloud: []
      }
    };
  }

  const messagesByParticipant: Record<string, number> = {};
  const wordsByParticipant: Record<string, number> = {};
  const messagesByDate: Record<string, number> = {};
  const messagesByHour: Record<number, number> = {};
  const messagesByDayOfWeek: Record<number, number> = {};
  const emojiCount: Record<string, number> = {};

  // Advanced tracking
  const sentimentSum: Record<string, number> = {};
  const sentimentCount: Record<string, number> = {};
  const dailySentiment: Record<string, { sum: number; count: number }> = {};

  const replyTimeSum: Record<string, number> = {};
  const replyTimeCount: Record<string, number> = {};

  const wordFrequency: Record<string, number> = {};

  let totalWords = 0;

  // Initialize hour counts
  for (let i = 0; i < 24; i++) {
    messagesByHour[i] = 0;
  }

  // Initialize day of week counts
  for (let i = 0; i < 7; i++) {
    messagesByDayOfWeek[i] = 0;
  }

  let lastMessageTime: Date | null = null;
  let lastSender: string | null = null;

  for (const msg of messages) {
    // Participant stats
    messagesByParticipant[msg.sender] = (messagesByParticipant[msg.sender] || 0) + 1;

    // Word count & Frequency
    // Simple regex to extract words, remove special chars, numbers, and short strings
    const rawWords = msg.content.toLowerCase().split(/[\s,.!?;:"()]+/).filter(w => w.length > 2);

    for (const w of rawWords) {
      if (!stopWords.has(w) && !/^\d+$/.test(w)) {
        wordFrequency[w] = (wordFrequency[w] || 0) + 1;
        totalWords++; // Counting only meaningful words? No, stats use totalWords.
      }
    }
    // Revert totalWords to original simple split for consistency? 
    // The previous implementation used `msg.content.split(/\s+/)`.
    // Let's stick to the simple split for `totalWords` valid metric, but use smart split for WordCloud.

    const simpleWords = msg.content.split(/\s+/).filter(w => w.length > 0);
    // totalWords += simpleWords.length; // Actually accumulate down below to avoid double count if I change logic

    // wordsByParticipant needs simple count
    wordsByParticipant[msg.sender] = (wordsByParticipant[msg.sender] || 0) + simpleWords.length;


    // Date stats
    const dateKey = msg.timestamp.toISOString().split('T')[0];
    messagesByDate[dateKey] = (messagesByDate[dateKey] || 0) + 1;

    // Hour stats
    const hour = msg.timestamp.getHours();
    messagesByHour[hour]++;

    // Day of week stats
    const dayOfWeek = msg.timestamp.getDay();
    messagesByDayOfWeek[dayOfWeek]++;

    // Emoji stats
    const emojis = msg.content.match(EMOJI_REGEX) || [];
    for (const emoji of emojis) {
      emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
    }

    // --- Advanced Stats Calculation ---

    // 1. Sentiment
    const sentiment = analyzeSentiment(msg.content);
    if (sentiment !== 0) {
      sentimentSum[msg.sender] = (sentimentSum[msg.sender] || 0) + sentiment;
      sentimentCount[msg.sender] = (sentimentCount[msg.sender] || 0) + 1;

      if (!dailySentiment[dateKey]) dailySentiment[dateKey] = { sum: 0, count: 0 };
      dailySentiment[dateKey].sum += sentiment;
      dailySentiment[dateKey].count += 1;
    }

    // 2. Reply Time
    if (lastMessageTime && lastSender && msg.sender !== lastSender) {
      const diffMs = msg.timestamp.getTime() - lastMessageTime.getTime();
      const diffMinutes = diffMs / (1000 * 60);

      if (diffMinutes < 360) { // < 6 hours
        replyTimeSum[msg.sender] = (replyTimeSum[msg.sender] || 0) + diffMinutes;
        replyTimeCount[msg.sender] = (replyTimeCount[msg.sender] || 0) + 1;
      }
    }

    lastMessageTime = msg.timestamp;
    lastSender = msg.sender;
  }

  // Recalculate global totalWords based on wordsByParticipant to match
  totalWords = Object.values(wordsByParticipant).reduce((a, b) => a + b, 0);

  // Aggregate Advanced Stats

  // Word Cloud Sorting
  const sortedWordCloud = Object.entries(wordFrequency)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 75); // Top 75 words

  const advanced = {
    sentiment: {
      byParticipant: {} as Record<string, number>,
      timeline: Object.entries(dailySentiment).map(([date, data]) => ({
        date,
        score: data.count > 0 ? parseFloat((data.sum / data.count).toFixed(2)) : 0
      })).sort((a, b) => a.date.localeCompare(b.date)),
      overall: 0
    },
    replyTime: {
      byParticipant: {} as Record<string, number>,
      overallAverage: 0
    },
    wordCloud: sortedWordCloud
  };

  // Finalize Sentiment
  let totalSentiment = 0;
  let totalSentimentCount = 0;
  Object.keys(sentimentSum).forEach(p => {
    if (sentimentCount[p] > 0) {
      advanced.sentiment.byParticipant[p] = parseFloat((sentimentSum[p] / sentimentCount[p]).toFixed(2));
      totalSentiment += sentimentSum[p];
      totalSentimentCount += sentimentCount[p];
    }
  });
  if (totalSentimentCount > 0) {
    advanced.sentiment.overall = parseFloat((totalSentiment / totalSentimentCount).toFixed(2));
  }

  // Finalize Reply Time
  let totalReplyTime = 0;
  let totalReplyCount = 0;
  Object.keys(replyTimeSum).forEach(p => {
    if (replyTimeCount[p] > 0) {
      advanced.replyTime.byParticipant[p] = Math.round(replyTimeSum[p] / replyTimeCount[p]);
      totalReplyTime += replyTimeSum[p];
      totalReplyCount += replyTimeCount[p];
    }
  });
  if (totalReplyCount > 0) {
    advanced.replyTime.overallAverage = Math.round(totalReplyTime / totalReplyCount);
  }

  // Find busiest day
  let busiestDay = { date: '', count: 0 };
  for (const [date, count] of Object.entries(messagesByDate)) {
    if (count > busiestDay.count) {
      busiestDay = { date, count };
    }
  }

  // Find busiest hour
  let busiestHour = 0;
  let maxHourCount = 0;
  for (const [hour, count] of Object.entries(messagesByHour)) {
    if (count > maxHourCount) {
      maxHourCount = count;
      busiestHour = parseInt(hour);
    }
  }

  // Top emojis
  const topEmojis = Object.entries(emojiCount)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const firstMessage = messages[0]?.timestamp || null;
  const lastMessage = messages[messages.length - 1]?.timestamp || null;
  const chatDuration = firstMessage && lastMessage
    ? Math.ceil((lastMessage.getTime() - firstMessage.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    totalMessages: messages.length,
    totalWords,
    participants: Object.keys(messagesByParticipant),
    messagesByParticipant,
    wordsByParticipant,
    messagesByDate,
    messagesByHour,
    messagesByDayOfWeek,
    topEmojis,
    averageMessageLength: totalWords / messages.length,
    busiestDay,
    busiestHour,
    firstMessage,
    lastMessage,
    chatDuration,
    advanced
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
