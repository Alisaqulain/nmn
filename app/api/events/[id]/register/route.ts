import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Event } from "@/models/Event";
import { createNotification } from "@/lib/notify";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await connectDB();
  const event = await Event.findById(id);
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const uid = new mongoose.Types.ObjectId(session.sub);
  if (event.registrations.some((r) => String(r) === session.sub)) {
    return NextResponse.json({ message: "Already registered" });
  }
  if (event.registrations.length >= event.capacity) {
    return NextResponse.json({ error: "Event full" }, { status: 400 });
  }
  event.registrations.push(uid);
  await event.save();
  await createNotification(
    session.sub,
    "Event registration",
    `You are registered for ${event.title}.`,
    "event"
  );
  return NextResponse.json({ ok: true });
}
