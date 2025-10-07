import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { analyticsService } from "@/lib/analytics-service";
import { getSelf } from "@/lib/auth-service";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const self = await getSelf();
    const overview = await analyticsService.getOverview(self.id);

    if (!overview) {
      return NextResponse.json({
        totalFollowers: 0,
        followerGrowth: 0,
        currentViewers: 0,
        isLive: false,
        streamsThisMonth: 0,
        totalStreamDuration: 0,
      });
    }

    return NextResponse.json(overview);
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
