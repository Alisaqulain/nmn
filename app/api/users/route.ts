import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const category = searchParams.get("category")?.trim() || "";
  const city = searchParams.get("city")?.trim() || "";

  await connectDB();
  const filter: Record<string, unknown> = { _id: { $ne: session.sub } };
  if (q) {
    filter.$or = [
      { name: new RegExp(q, "i") },
      { businessName: new RegExp(q, "i") },
      { email: new RegExp(q, "i") },
    ];
  }
  if (category) filter.category = new RegExp(`^${category}$`, "i");
  if (city) filter.location = new RegExp(city, "i");

  const members = await User.find(filter)
    .select("name businessName category phone email profileImage location chapterId")
    .populate("chapterId", "name city")
    .limit(50)
    .lean();

  return NextResponse.json({
    members: members.map((m) => ({
      id: String(m._id),
      name: m.name,
      businessName: m.businessName,
      category: m.category,
      phone: m.phone,
      email: m.email,
      profileImage: m.profileImage,
      location: m.location,
      chapter: m.chapterId
        ? {
            id: String((m.chapterId as { _id: unknown })._id),
            name: (m.chapterId as { name?: string }).name,
            city: (m.chapterId as { city?: string }).city,
          }
        : null,
    })),
  });
}
