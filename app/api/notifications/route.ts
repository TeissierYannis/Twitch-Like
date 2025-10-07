import { auth } from "@clerk/nextjs/server";
import { notificationService } from "@/lib/notification-service";
import { createSuccessResponse, createUnauthorizedResponse, createErrorResponse } from "@/lib/api-response";
import { getSelf } from "@/lib/auth-service";

// GET - Récupérer les notifications
export async function GET(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return createUnauthorizedResponse();
    }

    const self = await getSelf();
    const userId = self.id;

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const result = await notificationService.getAll(userId, page, limit);

    return createSuccessResponse(result.notifications, {
      page,
      limit,
      total: result.total,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return createErrorResponse("Failed to fetch notifications", 500);
  }
}

// POST - Marquer toutes les notifications comme lues
export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return createUnauthorizedResponse();
    }

    const self = await getSelf();
    const userId = self.id;

    const body = await request.json();
    const { action } = body;

    if (action === "mark_all_read") {
      await notificationService.markAllAsRead(userId);
      return createSuccessResponse({ message: "All notifications marked as read" });
    }

    return createErrorResponse("Invalid action", 400);
  } catch (error) {
    console.error("Error updating notifications:", error);
    return createErrorResponse("Failed to update notifications", 500);
  }
}