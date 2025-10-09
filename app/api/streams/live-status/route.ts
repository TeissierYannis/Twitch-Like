import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all live streams with their current status
export async function GET() {
    try {
        const streams = await db.stream.findMany({
            where: {
                isLive: true,
            },
            select: {
                id: true,
                userId: true,
                isLive: true,
            },
        });

        // Create a map of userId -> isLive for quick lookup
        const liveStatusMap: Record<string, boolean> = {};

        streams.forEach(stream => {
            liveStatusMap[stream.userId] = stream.isLive;
        });

        return NextResponse.json({ liveStatus: liveStatusMap });
    } catch (error) {
        console.error("[Live Status API] Error:", error);
        return NextResponse.json({ liveStatus: {} }, { status: 500 });
    }
}
