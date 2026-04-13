import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { User } from "@/models/User";
import { PasswordReset } from "@/models/PasswordReset";

const bodySchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { token, password } = parsed.data;
    await connectDB();
    const record = await PasswordReset.findOne({ token, used: false });
    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
    const passwordHash = await hashPassword(password);
    await User.updateOne({ email: record.email }, { $set: { passwordHash } });
    record.used = true;
    await record.save();
    return NextResponse.json({ message: "Password updated. You can sign in." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
