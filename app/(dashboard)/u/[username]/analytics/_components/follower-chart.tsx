"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DailyStats {
  date: string;
  newFollowers: number;
}

interface FollowerChartProps {
  data: DailyStats[];
}

export function FollowerChart({ data }: FollowerChartProps) {
  const chartData = data.map((stat) => ({
    date: format(new Date(stat.date), "dd MMM", { locale: fr }),
    followers: stat.newFollowers,
  }));

  return (
    <GlassCard variant="default" className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Follower Growth</h3>
        <p className="text-sm text-muted-foreground">
          New followers over the last {data.length} days
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="followers"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorFollowers)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
