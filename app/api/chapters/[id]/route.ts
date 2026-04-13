import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Chapter } from "@/models/Chapter";
import { User } from "@/models/User";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  description: z.string().optional(),
  meetingDay: z.string().optional(),
  meetingTime: z.string().optional(),
  venueAddress: z.string().optional(),
  venueName: z.string().optional(),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await connectDB();
  const chapter = await Chapter.findById(id).lean();
  if (!chapter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const members = await User.find({ chapterId: chapter._id })
    .select("name businessName category phone email profileImage location")
    .lean();
  return NextResponse.json({
    chapter: {
      id: String(chapter._id),
      name: chapter.name,
      city: chapter.city,
      slug: chapter.slug,
      description: chapter.description,
      meetingDay: chapter.meetingDay,
      meetingTime: chapter.meetingTime,
      venueAddress: chapter.venueAddress,
      venueName: chapter.venueName,
      members: members.map((m) => ({
        id: String(m._id),
        name: m.name,
        businessName: m.businessName,
        category: m.category,
        phone: m.phone,
        email: m.email,
        profileImage: m.profileImage,
        location: m.location,
      })),
    },
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const json = await req.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  await connectDB();
  const chapter = await Chapter.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!chapter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ chapter: { id: String(chapter._id), ...parsed.data } });
}
