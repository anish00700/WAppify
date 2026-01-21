import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Demo data
const demoData = [
  { name: 'Jan', messages: 120 },
  { name: 'Feb', messages: 180 },
  { name: 'Mar', messages: 240 },
  { name: 'Apr', messages: 310 },
  { name: 'May', messages: 280 },
  { name: 'Jun', messages: 420 },
  { name: 'Jul', messages: 380 },
  { name: 'Aug', messages: 450 },
  { name: 'Sep', messages: 520 },
  { name: 'Oct', messages: 480 },
  { name: 'Nov', messages: 560 },
  { name: 'Dec', messages: 620 },
];

export function DemoChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card variant="elevated" className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Daily Activity</CardTitle>
              <p className="text-sm text-muted-foreground">Your messaging patterns over time</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Live Preview</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demoData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ color: 'hsl(222, 47%, 11%)', fontWeight: 600 }}
                  itemStyle={{ color: 'hsl(160, 84%, 39%)' }}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="hsl(160, 84%, 39%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMessages)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
