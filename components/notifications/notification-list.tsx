"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Bell, 
  UserPlus, 
  Radio, 
  MessageSquare, 
  RadioIcon as RadioOff,
  CheckCheck,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotificationContext } from "./notification-provider";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "follow":
      return <UserPlus className="h-4 w-4 text-blue-500" />;
    case "stream_start":
      return <Radio className="h-4 w-4 text-green-500" />;
    case "stream_end":
      return <RadioOff className="h-4 w-4 text-orange-500" />;
    case "chat_mention":
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "follow":
      return "border-l-blue-500";
    case "stream_start":
      return "border-l-green-500";
    case "stream_end":
      return "border-l-orange-500";
    case "chat_mention":
      return "border-l-purple-500";
    default:
      return "border-l-muted";
  }
};

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    data?: Record<string, any>;
  };
  onMarkAsRead: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        "p-3 border-l-2 transition-all duration-200 cursor-pointer",
        getNotificationColor(notification.type),
        notification.read ? "bg-muted/20" : "bg-card hover:bg-accent/5",
        "relative group"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icône */}
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        
        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={cn(
              "text-sm font-medium truncate",
              notification.read ? "text-muted-foreground" : "text-foreground"
            )}>
              {notification.title}
            </p>
            
            {/* Indicateur non lu */}
            {!notification.read && (
              <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full ml-2" />
            )}
          </div>
          
          <p className={cn(
            "text-xs mt-1 line-clamp-2",
            notification.read ? "text-muted-foreground/70" : "text-muted-foreground"
          )}>
            {notification.message}
          </p>
          
          <p className="text-xs text-muted-foreground/60 mt-2">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: fr,
            })}
          </p>
        </div>
        
        {/* Actions au survol */}
        {isHovered && !notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            <CheckCheck className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function NotificationList() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh } = useNotificationContext();

  return (
    <GlassCard variant="default" className="w-full border-0 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({unreadCount} non lue{unreadCount > 1 ? "s" : ""})
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-8 px-2"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Tout lire
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Liste des notifications */}
      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Aucune notification
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Vous serez notifié des nouveaux followers et streams
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>
        )}
      </ScrollArea>
      
      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-border/20">
          <Button 
            variant="ghost" 
            className="w-full text-xs h-8"
            onClick={() => {
              // TODO: Rediriger vers une page complète des notifications
              console.log("Voir toutes les notifications");
            }}
          >
            Voir toutes les notifications
          </Button>
        </div>
      )}
    </GlassCard>
  );
}