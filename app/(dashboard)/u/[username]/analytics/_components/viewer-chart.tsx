"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DailyStats {
  date: string;
  peakViewers: number;
}

interface ViewerChartProps {
  data: DailyStats[];
}

export function ViewerChart({ data }: ViewerChartProps) {
  const chartData = data.map((stat) => ({
    date: format(new Date(stat.date), "dd MMM", { locale: fr }),
    viewers: stat.peakViewers,
  }));

  return (
    <GlassCard variant="default" className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Peak Viewers</h3>
        <p className="text-sm text-muted-foreground">
          Maximum concurrent viewers per day
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            cursor={{ fill: "hsl(var(--accent))" }}
          />
          <Bar
            dataKey="viewers"
            fill="hsl(var(--primary))"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
