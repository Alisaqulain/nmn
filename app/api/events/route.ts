import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Event } from "@/models/Event";

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  location: z.string().optional(),
  capacity: z.number().min(1).optional(),
});

export async function GET() {
  await connectDB();
  const events = await Event.find().sort({ startsAt: 1 }).lean();
  return NextResponse.json({
    events: events.map((e) => ({
      id: String(e._id),
      title: e.title,
      description: e.description,
      startsAt: e.startsAt,
      endsAt: e.endsAt,
      location: e.location,
      capacity: e.capacity,
      registered: (e.registrations as unknown[]).length,
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
  await connectDB();
  const event = await Event.create({
    ...parsed.data,
    startsAt: new Date(parsed.data.startsAt),
    endsAt: new Date(parsed.data.endsAt),
    createdBy: new mongoose.Types.ObjectId(session.sub),
  });
  return NextResponse.json({ id: String(event._id) }, { status: 201 });
}
