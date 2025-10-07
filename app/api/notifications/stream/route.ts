import { auth } from "@clerk/nextjs/server";
import { notificationService } from "@/lib/notification-service";
import { getSelf } from "@/lib/auth-service";

// Store active connections (in production, use Redis)
const connections = new Map<string, { controller: ReadableStreamDefaultController; lastCheck: number }>();

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get the database user ID
    const self = await getSelf();
    const userId = self.id;

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Store this connection with lastCheck set to 0 initially
        // This ensures we catch notifications created just before connection
        connections.set(userId, {
          controller,
          lastCheck: 0
        });

        // Send initial connection confirmation
        const connectedMsg = JSON.stringify({ type: "connected" });
        controller.enqueue(`data: ${connectedMsg}\n\n`);

        // Send initial unread notifications
        notificationService.getUnread(userId).then(notifications => {
          if (notifications.length > 0) {
            const msg = JSON.stringify({
              type: "notifications",
              data: notifications
            });
            controller.enqueue(`data: ${msg}\n\n`);

            // Update lastCheck after sending initial notifications
            const connection = connections.get(userId);
            if (connection) {
              connection.lastCheck = Date.now();
            }
          }
        }).catch(error => {
          console.error("[SSE] Error fetching initial notifications:", error);
        });

        // Set up polling for new notifications
        const pollInterval = setInterval(async () => {
          try {
            const connection = connections.get(userId);
            if (!connection) {
              clearInterval(pollInterval);
              return;
            }

            const notifications = await notificationService.getUnread(userId);

            const newNotifications = notifications.filter(
              notif => new Date(notif.createdAt).getTime() > connection.lastCheck
            );

            if (newNotifications.length > 0) {
              const msg = JSON.stringify({
                type: "new_notifications",
                data: newNotifications
              });

              try {
                controller.enqueue(`data: ${msg}\n\n`);
                // Update last check time only if enqueue succeeded
                connection.lastCheck = Date.now();
              } catch (enqueueError) {
                clearInterval(pollInterval);
                connections.delete(userId);
                return;
              }
            }

            // Send keepalive
            try {
              controller.enqueue(`data: ${JSON.stringify({ type: "ping" })}\n\n`);
            } catch (enqueueError) {
              clearInterval(pollInterval);
              connections.delete(userId);
              return;
            }
          } catch (error) {
            console.error("[SSE] Error in polling:", error);
          }
        }, 5000); // Poll every 5 seconds for near-realtime notifications

        // Cleanup function
        return () => {
          clearInterval(pollInterval);
          connections.delete(userId);
        };
      },

      cancel() {
        // Connection closed by client
        connections.delete(userId);
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      },
    });
  } catch (error) {
    console.error("SSE stream error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Utility function to send notification to specific user (called from other parts of the app)
export function sendNotificationToUser(userId: string, notification: any) {
  const connection = connections.get(userId);
  if (connection) {
    try {
      connection.controller.enqueue(`data: ${JSON.stringify({ 
        type: "instant_notification", 
        data: notification 
      })}\n\n`);
    } catch (error) {
      console.error("Error sending instant notification:", error);
      // Remove broken connection
      connections.delete(userId);
    }
  }
}