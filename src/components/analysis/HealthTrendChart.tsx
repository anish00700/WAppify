import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { HealthPoint } from '@/lib/advancedAnalytics';

interface HealthTrendChartProps {
    data: HealthPoint[];
}

export const HealthTrendChart = ({ data }: HealthTrendChartProps) => {
    if (!data?.length) return (
        <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Not enough data to calculate trend
        </div>
    );

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={(value) => {
                            const [year, month] = value.split('-');
                            const date = new Date(parseInt(year), parseInt(month) - 1);
                            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                        }}
                    />
                    <YAxis
                        hide
                        domain={[0, 100]}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                const point = payload[0].payload as HealthPoint;
                                return (
                                    <div className="bg-white p-3 border border-emerald-100 shadow-xl rounded-xl">
                                        <p className="text-sm font-semibold text-gray-900 mb-1">
                                            {new Date(label).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </p>
                                        <div className="space-y-1 text-sm">
                                            <p className="flex items-center justify-between gap-4">
                                                <span className="text-gray-500">Health Score</span>
                                                <span className="font-bold text-emerald-600">{point.score}/100</span>
                                            </p>
                                            <p className="flex items-center justify-between gap-4">
                                                <span className="text-gray-500">Volume</span>
                                                <span className="font-medium text-gray-900">{point.volume.toLocaleString()} msgs</span>
                                            </p>
                                            <p className="flex items-center justify-between gap-4">
                                                <span className="text-gray-500">Sentiment</span>
                                                <span className="font-medium text-gray-900">{(point.sentiment * 100).toFixed(0)}%</span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
