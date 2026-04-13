import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const users = await User.find()
    .select("-passwordHash")
    .populate("chapterId", "name city")
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
  return NextResponse.json({
    users: users.map((u) => ({
      id: String(u._id),
      email: u.email,
      name: u.name,
      role: u.role,
      plan: u.plan,
      businessName: u.businessName,
      category: u.category,
      chapter: u.chapterId
        ? {
            id: String((u.chapterId as { _id: unknown })._id),
            name: (u.chapterId as { name?: string }).name,
            city: (u.chapterId as { city?: string }).city,
          }
        : null,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
    })),
  });
}
