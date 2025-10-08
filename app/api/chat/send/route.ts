import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, streamId } = await req.json();

    if (!message || !streamId) {
      return NextResponse.json(
        { error: "Message and streamId required" },
        { status: 400 }
      );
    }

    // Trigger Pusher event
    await pusherServer.trigger(`stream-${streamId}`, "chat-message", {
      id: Date.now().toString(),
      message,
      timestamp: Date.now(),
      from: {
        name: user.username || user.firstName || "Anonymous",
        identity: user.id,
        imageUrl: user.imageUrl,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat send error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
