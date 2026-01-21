import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { formatNumber } from '@/lib/chatParser';

interface ParticipantChartProps {
  data: Record<string, number>;
}

const COLORS = [
  'hsl(160, 84%, 39%)',
  'hsl(160, 70%, 50%)',
  'hsl(160, 60%, 60%)',
  'hsl(160, 50%, 70%)',
  'hsl(160, 40%, 75%)',
  'hsl(160, 30%, 80%)',
];

export function ParticipantChart({ data }: ParticipantChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([name, count]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        fullName: name,
        messages: count,
      }))
      .sort((a, b) => b.messages - a.messages)
      .slice(0, 10);
  }, [data]);

  const total = chartData.reduce((sum, d) => sum + d.messages, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Messages by Participant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 11 }}
              />
              <YAxis 
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(222, 47%, 11%)', fontSize: 12 }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                  padding: '12px',
                }}
                formatter={(value: number, _, props) => {
                  const percentage = ((value / total) * 100).toFixed(1);
                  return [
                    <span key="value">
                      <strong>{formatNumber(value)}</strong> messages ({percentage}%)
                    </span>,
                    props.payload.fullName
                  ];
                }}
                labelFormatter={() => ''}
              />
              <Bar dataKey="messages" radius={[0, 6, 6, 0]}>
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
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
