import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  try {
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
        chapter: chapter ? { id: String(chapter._id), name: chapter.name, city: chapter.city } : null,
      },
    });
  } catch {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ user: null }, { status: 503 });
    }
    // Dev: allow browsing the app shell with a dummy session before DB is configured.
    const name =
      session.email === "admin@nmn.demo"
        ? "Demo Admin"
        : session.email === "riya@nmn.demo"
          ? "Riya Mehta (Demo)"
          : "Demo User";
    return NextResponse.json({
      user: {
        id: session.sub,
        email: session.email,
        name,
        role: session.role,
        plan: session.plan,
        emailVerified: true,
        businessName: "",
        category: "",
        phone: "",
        bio: "",
        profileImage: "",
        location: "",
        chapterId: null,
        chapter: null,
      },
    });
  }
}
