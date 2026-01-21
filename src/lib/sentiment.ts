
// Basic Sentiment Analysis Dictionary & Logic
// Derived from AFINN-165 (simplified)

const sentimentMap: Record<string, number> = {
    // Positive (Score 1 to 5)
    'amazing': 4, 'awesome': 4, 'beautiful': 3, 'best': 3, 'better': 2,
    'brilliant': 4, 'celebrate': 3, 'confident': 2, 'congrats': 3, 'congratulations': 3,
    'cool': 1, 'cute': 2, 'dedicated': 2, 'delighted': 3, 'excellent': 3,
    'excited': 3, 'exciting': 3, 'favorite': 2, 'fav': 2, 'fun': 2, 'funny': 2,
    'glad': 3, 'good': 2, 'great': 3, 'happy': 3, 'haha': 1, 'hahaha': 2,
    'hope': 2, 'hug': 2, 'interesting': 2, 'joy': 3, 'kind': 2, 'laugh': 1,
    'like': 1, 'lol': 1, 'love': 4, 'loved': 3, 'lovely': 3, 'luck': 3,
    'nice': 2, 'ok': 1, 'okay': 1, 'perfect': 3, 'please': 1, 'pleased': 2,
    'proud': 2, 'ready': 1, 'super': 3, 'support': 2, 'sweet': 2, 'thank': 2,
    'thanks': 2, 'thx': 1, 'win': 4, 'winner': 4, 'wonderful': 4, 'wow': 4,
    'yay': 3, 'yes': 1, 'yeah': 1, 'yep': 1, '100': 3, '🔥': 2, '❤️': 3, '😊': 1,
    '😂': 1, '😍': 3, '👍': 1, '🎉': 3, '✨': 2,

    // Negative (Score -1 to -5)
    'bad': -3, 'boring': -2, 'broken': -1, 'busy': -1, 'crazy': -1,
    'cry': -2, 'damn': -2, 'dead': -3, 'die': -3, 'disappointed': -2,
    'done': -1, 'dumb': -3, 'error': -2, 'fail': -2, 'failed': -2,
    'fault': -2, 'fear': -2, 'fight': -2, 'fuck': -4, 'hate': -3,
    'hell': -4, 'help': -2, 'hurt': -2, 'ignore': -1, 'insane': -2,
    'issue': -1, 'kill': -3, 'late': -1, 'leave': -1, 'lie': -2,
    'lone': -1, 'lose': -3, 'loss': -3, 'mad': -3, 'miss': -1,
    'missed': -1, 'no': -1, 'nope': -1, 'pain': -2, 'problem': -2,
    'sad': -2, 'shit': -4, 'shut': -1, 'sick': -2, 'sorry': -1,
    'stop': -1, 'stupid': -2, 'suck': -3, 'terrible': -3, 'tired': -2,
    'trouble': -2, 'ugly': -3, 'upset': -2, 'waste': -2, 'weak': -2,
    'worry': -3, 'worst': -3, 'wrong': -2, 'wtf': -4, '😭': -2, '😞': -1,
    '😡': -2, '💔': -3, '👎': -1,
};

// Returns a score between -5 (Very Negative) and 5 (Very Positive)
// 0 is Neutral
export function analyzeSentiment(text: string): number {
    if (!text) return 0;

    const words = text.toLowerCase().split(/[\s,.!?;:]+/);
    let score = 0;
    let wordCount = 0;

    words.forEach(word => {
        if (sentimentMap[word]) {
            score += sentimentMap[word];
            wordCount++;
        }
    });

    // Normalize slightly? Or just raw score sum?
    // Raw sum is better for "more intense" messages.
    // But for an "Average" sentiment, we might want per-message average.

    // Cap at -5 to 5 for single message normalization if needed, 
    // but for trend analysis, the raw sum indicates intensity.

    return score;
}

export function getSentimentLabel(score: number): { label: string; color: string } {
    if (score >= 2) return { label: 'Positive', color: 'text-green-500' };
    if (score <= -2) return { label: 'Negative', color: 'text-red-500' };
    return { label: 'Neutral', color: 'text-gray-500' };
}
