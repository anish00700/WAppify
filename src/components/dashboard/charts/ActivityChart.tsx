import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ActivityChartProps {
  data: Record<string, number>;
}

export function ActivityChart({ data }: ActivityChartProps) {
  const chartData = useMemo(() => {
    const entries = Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date,
        messages: count,
        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }));
    
    // Sample if too many data points
    if (entries.length > 60) {
      const step = Math.ceil(entries.length / 60);
      return entries.filter((_, i) => i % step === 0);
    }
    return entries;
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Activity Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="label" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 11 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                  padding: '12px',
                }}
                labelStyle={{ color: 'hsl(222, 47%, 11%)', fontWeight: 600, marginBottom: '4px' }}
                itemStyle={{ color: 'hsl(160, 84%, 39%)' }}
                formatter={(value: number) => [`${value} messages`, '']}
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorActivity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
