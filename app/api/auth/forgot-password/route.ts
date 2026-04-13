import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PasswordReset } from "@/models/PasswordReset";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const { email } = parsed.data;
    await connectDB();
    const user = await User.findOne({ email });
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    if (user) {
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
      await PasswordReset.create({ email, token, expiresAt });
      console.log(`[NMN Mock Email] Password reset for ${email}: ${base}/forgot-password?reset=${token}`);
    }
    return NextResponse.json({
      message: "If an account exists, a reset link has been sent (check server logs in development).",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
