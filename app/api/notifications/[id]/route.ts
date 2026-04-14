import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Notification } from "@/models/Notification";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  const read = Boolean(body.read);
  try {
    await connectDB();
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  const n = await Notification.findOneAndUpdate(
    { _id: id, userId: session.sub },
    { $set: { read } },
    { new: true }
  );
  if (!n) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
