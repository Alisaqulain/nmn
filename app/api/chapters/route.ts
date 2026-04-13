import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Chapter } from "@/models/Chapter";
import { User } from "@/models/User";
import { slugify } from "@/lib/slug";

const createSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  description: z.string().optional(),
  meetingDay: z.string().optional(),
  meetingTime: z.string().optional(),
  venueAddress: z.string().optional(),
  venueName: z.string().optional(),
});

export async function GET() {
  await connectDB();
  const chapters = await Chapter.find().sort({ city: 1, name: 1 }).lean();
  const counts = await User.aggregate([
    { $match: { chapterId: { $ne: null } } },
    { $group: { _id: "$chapterId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count as number]));
  return NextResponse.json({
    chapters: chapters.map((c) => ({
      id: String(c._id),
      name: c.name,
      city: c.city,
      slug: c.slug,
      description: c.description,
      meetingDay: c.meetingDay,
      meetingTime: c.meetingTime,
      venueAddress: c.venueAddress,
      venueName: c.venueName,
      memberCount: countMap.get(String(c._id)) ?? 0,
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
  let slug = slugify(`${parsed.data.city}-${parsed.data.name}`);
  let n = 0;
  while (await Chapter.findOne({ slug })) {
    n += 1;
    slug = `${slugify(`${parsed.data.city}-${parsed.data.name}`)}-${n}`;
  }
  const chapter = await Chapter.create({
    ...parsed.data,
    slug,
  });
  return NextResponse.json({
    chapter: {
      id: String(chapter._id),
      slug: chapter.slug,
      name: chapter.name,
      city: chapter.city,
    },
  });
}
