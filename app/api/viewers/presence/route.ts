import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const { streamId, userId, username } = await req.json();

    if (!streamId) {
      return NextResponse.json(
        { error: "StreamId required" },
        { status: 400 }
      );
    }

    // Trigger presence update
    await pusherServer.trigger(`presence-stream-${streamId}`, "viewer-joined", {
      userId: userId || `anonymous-${Date.now()}`,
      username: username || "Anonymous",
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Viewer presence error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
