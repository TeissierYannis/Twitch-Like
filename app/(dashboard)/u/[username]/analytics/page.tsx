"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import { OverviewCards } from "./_components/overview-cards";
import { FollowerChart } from "./_components/follower-chart";
import { ViewerChart } from "./_components/viewer-chart";
import { SessionsTable } from "./_components/sessions-table";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const { overview, history, sessions, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive">Error loading analytics</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No analytics data available</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Start streaming to see your analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your streaming performance and growth
        </p>
      </div>

      {/* Overview Cards */}
      <OverviewCards
        totalFollowers={overview.totalFollowers}
        followerGrowth={overview.followerGrowth}
        currentViewers={overview.currentViewers}
        isLive={overview.isLive}
        streamsThisMonth={overview.streamsThisMonth}
        totalStreamDuration={overview.totalStreamDuration}
      />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FollowerChart data={history} />
        <ViewerChart data={history} />
      </div>

      {/* Sessions Table */}
      <SessionsTable sessions={sessions} />
    </div>
  );
}
