"use client";

import { useState, useEffect } from "react";

interface AnalyticsOverview {
  totalFollowers: number;
  followerGrowth: number;
  currentViewers: number;
  isLive: boolean;
  streamsThisMonth: number;
  totalStreamDuration: number;
}

interface DailyStats {
  id: string;
  date: string;
  newFollowers: number;
  totalViews: number;
  streamDuration: number;
  peakViewers: number;
  totalMessages: number;
}

interface StreamSession {
  id: string;
  startedAt: string;
  endedAt: string | null;
  peakViewers: number;
  averageViewers: number;
  totalMessages: number;
  duration: number | null;
  title: string | null;
}

export function useAnalytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [history, setHistory] = useState<DailyStats[]>([]);
  const [sessions, setSessions] = useState<StreamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      const response = await fetch("/api/analytics/overview");
      if (!response.ok) throw new Error("Failed to fetch overview");
      const data = await response.json();
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch overview");
    }
  };

  const fetchHistory = async (days: number = 7) => {
    try {
      const response = await fetch(`/api/analytics/history?days=${days}`);
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch history");
    }
  };

  const fetchSessions = async (limit: number = 10) => {
    try {
      const response = await fetch(`/api/analytics/sessions?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sessions");
    }
  };

  const refresh = async (days: number = 7, sessionLimit: number = 10) => {
    setLoading(true);
    setError(null);

    await Promise.all([
      fetchOverview(),
      fetchHistory(days),
      fetchSessions(sessionLimit),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    overview,
    history,
    sessions,
    loading,
    error,
    refresh,
  };
}
