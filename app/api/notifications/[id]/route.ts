import { auth } from "@clerk/nextjs/server";
import { notificationService } from "@/lib/notification-service";
import { createSuccessResponse, createUnauthorizedResponse, createErrorResponse, createNotFoundResponse } from "@/lib/api-response";
import { getSelf } from "@/lib/auth-service";

// PATCH - Marquer une notification comme lue
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return createUnauthorizedResponse();
    }

    const self = await getSelf();
    const userId = self.id;

    const { id } = await params;
    const body = await request.json();
    const { read } = body;

    if (read === true) {
      await notificationService.markAsRead(id, userId);
      return createSuccessResponse({ message: "Notification marked as read" });
    }

    return createErrorResponse("Invalid data", 400);
  } catch (error: any) {
    console.error("Error updating notification:", error);

    if (error.code === "P2025") {
      return createNotFoundResponse("Notification");
    }

    return createErrorResponse("Failed to update notification", 500);
  }
}