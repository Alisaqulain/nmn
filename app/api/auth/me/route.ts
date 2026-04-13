import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  await connectDB();
  const user = await User.findById(session.sub).populate("chapterId").lean();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const chapter = user.chapterId as { _id: unknown; name?: string; city?: string } | null;
  return NextResponse.json({
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
      emailVerified: user.emailVerified,
      businessName: user.businessName,
      category: user.category,
      phone: user.phone,
      bio: user.bio,
      profileImage: user.profileImage,
      location: user.location,
      chapterId: chapter ? String(chapter._id) : null,
      chapter: chapter
        ? { id: String(chapter._id), name: chapter.name, city: chapter.city }
        : null,
    },
  });
}
