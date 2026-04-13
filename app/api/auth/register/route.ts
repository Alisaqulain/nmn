import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { signToken, AUTH_COOKIE } from "@/lib/jwt";
import { User } from "@/models/User";
import { randomBytes } from "crypto";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const { email, password, name } = parsed.data;
    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const passwordHash = await hashPassword(password);
    const verifyToken = randomBytes(24).toString("hex");
    const user = await User.create({
      email,
      passwordHash,
      name,
      emailVerified: false,
    });
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    console.log(`[NMN Mock Email] Verify ${email}: ${base}/api/auth/verify-email?token=${verifyToken}&userId=${user._id}`);
    const token = await signToken({
      sub: String(user._id),
      email: user.email,
      role: user.role as "admin" | "member",
      plan: user.plan as "free" | "premium",
    });
    const res = NextResponse.json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        emailVerified: user.emailVerified,
      },
      message: "Account created. Check server logs for mock email verification link.",
    });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
