import { auth } from "@clerk/nextjs/server";
import { notificationService } from "@/lib/notification-service";
import { getSelf } from "@/lib/auth-service";
import { NextResponse } from "next/server";

// GET - Tester les notifications
export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const self = await getSelf();
    const userId = self.id;

    // Récupérer toutes les notifications
    const allNotifications = await notificationService.getAll(userId, 1, 50);
    const unreadNotifications = await notificationService.getUnread(userId);
    const unreadCount = await notificationService.getUnreadCount(userId);

    return NextResponse.json({
      success: true,
      userId,
      all: allNotifications,
      unread: unreadNotifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error testing notifications:", error);
    return NextResponse.json({ error: "Internal error", details: error }, { status: 500 });
  }
}
