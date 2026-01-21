import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud } from 'lucide-react';

interface WordCloudChartProps {
    data: { text: string; value: number }[];
}

const COLORS = [
    'text-primary',
    'text-blue-500',
    'text-indigo-500',
    'text-purple-500',
    'text-pink-500',
    'text-emerald-500',
    'text-amber-500',
];

export function WordCloudChart({ data }: WordCloudChartProps) {
    const words = useMemo(() => {
        if (!data.length) return [];

        // Normalize sizes
        const maxVal = data[0].value;
        const minVal = data[data.length - 1].value;
        const range = maxVal - minVal;

        // Shuffle slightly to mix big and small? 
        // Or just keep sorted. Sorted is easier to read.
        // Let's randomize order for "Cloud" effect.
        const shuffled = [...data].sort(() => Math.random() - 0.5);

        return shuffled.map((item, i) => {
            // Linear scale: 0.8rem to 3rem
            const normalized = range > 0 ? (item.value - minVal) / range : 0.5;
            const size = 0.8 + (normalized * 2.5);

            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            return { ...item, size, color };
        });
    }, [data]);

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-primary" />
                    Word Cloud
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 p-4 min-h-[300px]">
                    {words.map((word) => (
                        <span
                            key={word.text}
                            className={`font-bold transition-all hover:scale-110 cursor-default ${word.color}`}
                            style={{ fontSize: `${word.size}rem`, opacity: 0.8 + (word.size / 10) }}
                            title={`${word.text}: ${word.value} occurrences`}
                        >
                            {word.text}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
