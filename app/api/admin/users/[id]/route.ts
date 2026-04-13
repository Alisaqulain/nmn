import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { signToken, AUTH_COOKIE } from "@/lib/jwt";

const patchSchema = z.object({
  role: z.enum(["admin", "member"]).optional(),
  plan: z.enum(["free", "premium"]).optional(),
});

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
  const user = await User.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const res = NextResponse.json({
    user: {
      id: String(user._id),
      role: user.role,
      plan: user.plan,
    },
  });
  if (id === session.sub) {
    const token = await signToken({
      sub: String(user._id),
      email: user.email,
      role: user.role as "admin" | "member",
      plan: user.plan as "free" | "premium",
    });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return res;
}
