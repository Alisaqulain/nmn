import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import { signToken, AUTH_COOKIE } from "@/lib/jwt";
import { User } from "@/models/User";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function getDevDummyUser(email: string, password: string) {
  if (process.env.NODE_ENV === "production") return null;
  const normalized = email.trim().toLowerCase();
  const candidates = [
    { sub: "dev-admin", email: "admin@nmn.demo", password: "Admin123!", role: "admin" as const, plan: "premium" as const, name: "Demo Admin" },
    {
      sub: "dev-member",
      email: "riya@nmn.demo",
      password: "Member123!",
      role: "member" as const,
      plan: "premium" as const,
      name: "Riya Mehta (Demo)",
    },
  ];
  const u = candidates.find((c) => c.email === normalized && c.password === password);
  return u ?? null;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { email, password } = parsed.data;

    let token: string;
    let responseUser: { id: string; email: string; name: string; role: string; plan: string; emailVerified: boolean };

    try {
      await connectDB();
      const user = await User.findOne({ email });
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
      token = await signToken({
        sub: String(user._id),
        email: user.email,
        role: user.role as "admin" | "member",
        plan: user.plan as "free" | "premium",
      });
      responseUser = {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: String(user.role),
        plan: String(user.plan),
        emailVerified: !!user.emailVerified,
      };
    } catch (dbErr) {
      const dummy = getDevDummyUser(email, password);
      if (!dummy) {
        console.error(dbErr);
        return NextResponse.json({ error: "Login failed (DB not connected)" }, { status: 503 });
      }
      token = await signToken({
        sub: dummy.sub,
        email: dummy.email,
        role: dummy.role,
        plan: dummy.plan,
      });
      responseUser = {
        id: dummy.sub,
        email: dummy.email,
        name: dummy.name,
        role: dummy.role,
        plan: dummy.plan,
        emailVerified: true,
      };
    }

    const res = NextResponse.json({ user: responseUser });
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
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
