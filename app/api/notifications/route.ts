import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Notification } from "@/models/Notification";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const items = await Notification.find({ userId: session.sub }).sort({ createdAt: -1 }).limit(50).lean();
  return NextResponse.json({
    notifications: items.map((n) => ({
      id: String(n._id),
      title: n.title,
      message: n.message,
      read: n.read,
      type: n.type,
      createdAt: n.createdAt,
    })),
  });
}
