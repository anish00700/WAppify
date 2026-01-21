import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { formatHour } from '@/lib/chatParser';

interface HourlyChartProps {
  data: Record<number, number>;
}

export function HourlyChart({ data }: HourlyChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(data).map(([hour, count]) => ({
      hour: parseInt(hour),
      messages: count,
      label: formatHour(parseInt(hour)),
    }));
  }, [data]);

  const maxMessages = Math.max(...chartData.map(d => d.messages));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Hourly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="label" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 10 }}
                interval={2}
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
                formatter={(value: number) => [`${value} messages`, '']}
              />
              <Bar dataKey="messages" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell 
                    key={`cell-${entry.hour}`}
                    fill={entry.messages === maxMessages 
                      ? 'hsl(160, 84%, 39%)' 
                      : 'hsl(160, 30%, 85%)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
