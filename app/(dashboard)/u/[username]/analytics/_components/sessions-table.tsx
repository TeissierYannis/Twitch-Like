"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, Users, MessageSquare } from "lucide-react";

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

interface SessionsTableProps {
  sessions: StreamSession[];
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <GlassCard variant="default" className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Recent Streams</h3>
        <p className="text-sm text-muted-foreground">
          Your latest streaming sessions
        </p>
      </div>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No stream sessions yet</p>
            <p className="text-sm mt-1">Start streaming to see analytics here</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium">
                  {session.title || "Untitled Stream"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(session.startedAt), "PPpp", { locale: fr })}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDuration(session.duration)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{session.peakViewers} peak</span>
                  <span className="text-muted-foreground">
                    ({session.averageViewers.toFixed(0)} avg)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{session.totalMessages}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
