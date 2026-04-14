import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Testimonial } from "@/models/Testimonial";
import { User } from "@/models/User";
import { createNotification } from "@/lib/notify";

const createSchema = z.object({
  toUserId: z.string(),
  content: z.string().min(10),
  rating: z.number().min(1).max(5).optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const forUser = searchParams.get("for");
  try {
    await connectDB();
  } catch {
    // Dev-friendly: homepage can load even before DB is configured.
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ testimonials: [] });
    }
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  const filter: Record<string, unknown> = { approved: true };
  if (forUser && mongoose.Types.ObjectId.isValid(forUser)) {
    filter.toUserId = forUser;
  }
  const list = await Testimonial.find(filter)
    .sort({ createdAt: -1 })
    .limit(40)
    .populate("fromUserId", "name businessName profileImage")
    .populate("toUserId", "name businessName")
    .lean();
  return NextResponse.json({
    testimonials: list.map((t) => ({
      id: String(t._id),
      content: t.content,
      rating: t.rating,
      createdAt: t.createdAt,
      from: t.fromUserId
        ? {
            name: (t.fromUserId as { name?: string }).name,
            businessName: (t.fromUserId as { businessName?: string }).businessName,
            profileImage: (t.fromUserId as { profileImage?: string }).profileImage,
          }
        : null,
      to: t.toUserId
        ? {
            name: (t.toUserId as { name?: string }).name,
            businessName: (t.toUserId as { businessName?: string }).businessName,
          }
        : null,
    })),
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { toUserId, content, rating } = parsed.data;
  if (toUserId === session.sub) {
    return NextResponse.json({ error: "Cannot testimonial yourself" }, { status: 400 });
  }
  await connectDB();
  const target = await User.findById(toUserId);
  if (!target) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  const t = await Testimonial.create({
    fromUserId: session.sub,
    toUserId,
    content,
    rating: rating ?? 5,
  });
  await createNotification(
    toUserId,
    "New testimonial",
    `${(await User.findById(session.sub))?.name || "A member"} shared a testimonial about you.`,
    "info"
  );
  return NextResponse.json({ id: String(t._id) }, { status: 201 });
}
