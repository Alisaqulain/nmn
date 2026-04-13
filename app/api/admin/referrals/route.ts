import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Referral } from "@/models/Referral";

const patchSchema = z.object({
  status: z.enum(["open", "won", "lost"]),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const list = await Referral.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("fromUserId", "name email businessName")
    .populate("toUserId", "name email businessName")
    .lean();
  return NextResponse.json({
    referrals: list.map((r) => ({
      id: String(r._id),
      leadName: r.leadName,
      leadContact: r.leadContact,
      notes: r.notes,
      status: r.status,
      createdAt: r.createdAt,
      from: r.fromUserId
        ? {
            id: String((r.fromUserId as { _id: unknown })._id),
            name: (r.fromUserId as { name?: string }).name,
            email: (r.fromUserId as { email?: string }).email,
          }
        : null,
      to: r.toUserId
        ? {
            id: String((r.toUserId as { _id: unknown })._id),
            name: (r.toUserId as { name?: string }).name,
            email: (r.toUserId as { email?: string }).email,
          }
        : null,
    })),
  });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const json = await req.json();
  const id = json.id as string;
  const parsed = patchSchema.safeParse(json);
  if (!id || !mongoose.Types.ObjectId.isValid(id) || !parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  await connectDB();
  await Referral.findByIdAndUpdate(id, { $set: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}
