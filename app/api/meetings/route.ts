import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Meeting } from "@/models/Meeting";
import { User } from "@/models/User";

const createSchema = z.object({
  chapterId: z.string(),
  title: z.string().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
  agenda: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const chapterId = searchParams.get("chapterId");
  await connectDB();
  const me = await User.findById(session.sub).lean();
  const filter: Record<string, unknown> = {};
  if (session.role === "admin" && chapterId && mongoose.Types.ObjectId.isValid(chapterId)) {
    filter.chapterId = chapterId;
  } else if (me?.chapterId) {
    filter.chapterId = me.chapterId;
  } else if (!chapterId) {
    return NextResponse.json({ meetings: [] });
  } else if (mongoose.Types.ObjectId.isValid(chapterId)) {
    filter.chapterId = chapterId;
  }
  const meetings = await Meeting.find(filter)
    .sort({ startsAt: -1 })
    .limit(30)
    .populate("attendance.userId", "name")
    .lean();
  return NextResponse.json({
    meetings: meetings.map((m) => ({
      id: String(m._id),
      chapterId: String(m.chapterId),
      title: m.title,
      startsAt: m.startsAt,
      endsAt: m.endsAt,
      agenda: m.agenda,
      attendance: (m.attendance as { userId: unknown; present: boolean }[]).map((a) => {
        const u = a.userId as { _id?: unknown; name?: string } | null;
        return {
          userId: u && typeof u === "object" && "_id" in u && u._id ? String(u._id) : String(a.userId),
          present: a.present,
          memberName: u && typeof u === "object" && "name" in u ? u.name : undefined,
        };
      }),
    })),
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { chapterId, title, startsAt, endsAt, agenda } = parsed.data;
  if (!mongoose.Types.ObjectId.isValid(chapterId)) {
    return NextResponse.json({ error: "Invalid chapter" }, { status: 400 });
  }
  await connectDB();
  const members = await User.find({ chapterId }).select("_id").lean();
  const attendance = members.map((u) => ({
    userId: u._id,
    present: false,
  }));
  const meeting = await Meeting.create({
    chapterId,
    title: title || "Weekly Chapter Meeting",
    startsAt: new Date(startsAt),
    endsAt: endsAt ? new Date(endsAt) : undefined,
    agenda,
    attendance,
  });
  return NextResponse.json({ id: String(meeting._id) }, { status: 201 });
}
