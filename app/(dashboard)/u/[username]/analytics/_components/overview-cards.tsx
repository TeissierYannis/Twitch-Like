"use client";

import { Users, TrendingUp, Eye, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface OverviewCardsProps {
  totalFollowers: number;
  followerGrowth: number;
  currentViewers: number;
  isLive: boolean;
  streamsThisMonth: number;
  totalStreamDuration: number;
}

export function OverviewCards({
  totalFollowers,
  followerGrowth,
  currentViewers,
  isLive,
  streamsThisMonth,
  totalStreamDuration,
}: OverviewCardsProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const cards = [
    {
      icon: Eye,
      label: isLive ? "Current Viewers" : "Total Followers",
      value: isLive ? currentViewers : totalFollowers,
      subtitle: isLive ? "Live now" : `${followerGrowth >= 0 ? "+" : ""}${followerGrowth.toFixed(1)}% this month`,
      color: isLive ? "text-red-500" : "text-blue-500",
      bgColor: isLive ? "bg-red-500/10" : "bg-blue-500/10",
    },
    {
      icon: Users,
      label: "Total Followers",
      value: totalFollowers,
      subtitle: `${followerGrowth >= 0 ? "+" : ""}${followerGrowth.toFixed(1)}% growth`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: TrendingUp,
      label: "Streams This Month",
      value: streamsThisMonth,
      subtitle: "Total sessions",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Clock,
      label: "Stream Time",
      value: formatDuration(totalStreamDuration),
      subtitle: "This month",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <GlassCard key={index} variant="default" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </p>
            </div>
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
