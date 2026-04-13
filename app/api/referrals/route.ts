import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Referral } from "@/models/Referral";
import { User } from "@/models/User";
import { createNotification } from "@/lib/notify";

const createSchema = z.object({
  toUserId: z.string(),
  leadName: z.string().min(1),
  leadContact: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.plan !== "premium") {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "given";
  await connectDB();
  const filter =
    type === "received"
      ? { toUserId: new mongoose.Types.ObjectId(session.sub) }
      : { fromUserId: new mongoose.Types.ObjectId(session.sub) };
  const list = await Referral.find(filter)
    .sort({ createdAt: -1 })
    .populate("fromUserId", "name businessName")
    .populate("toUserId", "name businessName")
    .lean();

  const [givenCount, receivedCount] = await Promise.all([
    Referral.countDocuments({ fromUserId: session.sub }),
    Referral.countDocuments({ toUserId: session.sub }),
  ]);

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
            businessName: (r.fromUserId as { businessName?: string }).businessName,
          }
        : null,
      to: r.toUserId
        ? {
            id: String((r.toUserId as { _id: unknown })._id),
            name: (r.toUserId as { name?: string }).name,
            businessName: (r.toUserId as { businessName?: string }).businessName,
          }
        : null,
    })),
    stats: { given: givenCount, received: receivedCount },
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.plan !== "premium") {
    return NextResponse.json({ error: "Premium membership required to give referrals" }, { status: 403 });
  }
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { toUserId, leadName, leadContact, notes } = parsed.data;
  if (toUserId === session.sub) {
    return NextResponse.json({ error: "Cannot refer to yourself" }, { status: 400 });
  }
  if (!mongoose.Types.ObjectId.isValid(toUserId)) {
    return NextResponse.json({ error: "Invalid member" }, { status: 400 });
  }
  await connectDB();
  const me = await User.findById(session.sub);
  const ref = await Referral.create({
    fromUserId: session.sub,
    toUserId,
    leadName,
    leadContact,
    notes,
    chapterId: me?.chapterId ?? undefined,
  });
  await createNotification(
    toUserId,
    "New referral",
    `${me?.name || "A member"} sent you a referral: ${leadName}.`,
    "referral"
  );
  return NextResponse.json({ id: String(ref._id) }, { status: 201 });
}
