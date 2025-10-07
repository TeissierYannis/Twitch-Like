import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/lib/analytics-service";
import { getSelf } from "@/lib/auth-service";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const self = await getSelf();
    const searchParams = req.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7");

    const stats = await analyticsService.getDailyStats(self.id, days);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching analytics history:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
