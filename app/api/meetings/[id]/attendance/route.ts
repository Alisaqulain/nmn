import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Meeting } from "@/models/Meeting";

const bodySchema = z.object({
  userId: z.string(),
  present: z.boolean(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { userId, present } = parsed.data;
  await connectDB();
  const meeting = await Meeting.findById(id);
  if (!meeting) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const idx = meeting.attendance.findIndex((a) => String(a.userId) === userId);
  if (idx === -1) {
    meeting.attendance.push({
      userId: new mongoose.Types.ObjectId(userId),
      present,
      markedBy: new mongoose.Types.ObjectId(session.sub),
      markedAt: new Date(),
    });
  } else {
    meeting.attendance[idx].present = present;
    meeting.attendance[idx].markedBy = new mongoose.Types.ObjectId(session.sub);
    meeting.attendance[idx].markedAt = new Date();
  }
  await meeting.save();
  return NextResponse.json({ ok: true });
}
