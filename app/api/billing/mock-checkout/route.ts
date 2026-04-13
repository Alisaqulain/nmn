import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { signToken, AUTH_COOKIE } from "@/lib/jwt";
import { createNotification } from "@/lib/notify";

const bodySchema = z.object({
  plan: z.enum(["premium"]),
  mockPaymentId: z.string().optional(),
});

/** Mock Razorpay-style checkout — upgrades user to premium without real payment */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  await connectDB();
  const user = await User.findByIdAndUpdate(
    session.sub,
    { $set: { plan: "premium" } },
    { new: true }
  );
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const token = await signToken({
    sub: String(user._id),
    email: user.email,
    role: user.role as "admin" | "member",
    plan: "premium",
  });
  await createNotification(
    session.sub,
    "Premium activated",
    "Your National Millionaire Network premium membership is now active. Referrals and chapters are unlocked.",
    "system"
  );
  const res = NextResponse.json({
    success: true,
    mockReceipt: {
      id: parsed.data.mockPaymentId || `pay_mock_${Date.now()}`,
      amount: 49900,
      currency: "INR",
      plan: "premium",
    },
  });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
