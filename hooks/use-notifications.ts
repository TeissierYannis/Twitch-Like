"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "follow" | "stream_start" | "chat_mention" | "stream_end";
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Calculer le nombre de notifications non lues
  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  // Connecter au stream SSE
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      return eventSourceRef.current;
    }

    const eventSource = new EventSource("/api/notifications/stream");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "connected":
            setIsConnected(true);
            break;

          case "notifications":
            // Notifications initiales
            setNotifications(data.data);
            updateUnreadCount(data.data);
            break;

          case "new_notifications":
            // Nouvelles notifications
            const newNotifs = data.data as Notification[];
            setNotifications(prev => {
              const combined = [...newNotifs, ...prev];
              updateUnreadCount(combined);
              return combined;
            });

            // Afficher toast pour nouvelles notifications
            newNotifs.forEach(notif => {
              toast.success(notif.title, {
                description: notif.message,
                duration: 4000,
              });
            });
            break;

          case "instant_notification":
            // Notification en temps réel
            const instantNotif = data.data as Notification;
            setNotifications(prev => [instantNotif, ...prev]);
            setUnreadCount(prev => prev + 1);

            toast.success(instantNotif.title, {
              description: instantNotif.message,
              duration: 4000,
            });
            break;

          case "ping":
            // Keepalive
            break;

          default:
            console.warn("[useNotifications] Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("[useNotifications] Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);

      // Reconnexion automatique après 5 secondes
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    };

    return eventSource;
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "mark_all_read" }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  // Rafraîchir les notifications
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data);
          updateUnreadCount(data.data);
        }
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    }
  }, []);

  // Effet pour établir la connexion SSE
  useEffect(() => {
    const eventSource = connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    refresh,
  };
}