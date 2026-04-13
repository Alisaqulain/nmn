import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

/** Mock email verification — token is not stored; userId + any token verifies in dev */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");
  if (!userId || !token) {
    return NextResponse.redirect(new URL("/login?verified=0", req.url));
  }
  await connectDB();
  await User.findByIdAndUpdate(userId, { emailVerified: true });
  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}
