import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/lib/analytics-service";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const self = await getSelf();
    const userStream = await db.stream.findUnique({
      where: { userId: self.id },
    });

    if (!userStream) {
      return NextResponse.json([]);
    }

    const searchParams = req.nextUrl.searchParams;
    const minutes = parseInt(searchParams.get("minutes") || "60");

    const metrics = await analyticsService.getRealtimeMetrics(userStream.id, minutes);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching realtime metrics:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
