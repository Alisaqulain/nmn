import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { Chapter } from "@/models/Chapter";
import { Referral } from "@/models/Referral";
import { Event } from "@/models/Event";
import { Meeting } from "@/models/Meeting";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const [users, chapters, referrals, events, meetings, premium, free] = await Promise.all([
    User.countDocuments(),
    Chapter.countDocuments(),
    Referral.countDocuments(),
    Event.countDocuments(),
    Meeting.countDocuments(),
    User.countDocuments({ plan: "premium" }),
    User.countDocuments({ plan: "free" }),
  ]);
  const recentReferrals = await Referral.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("fromUserId", "name")
    .populate("toUserId", "name")
    .lean();
  return NextResponse.json({
    overview: { users, chapters, referrals, events, meetings, premium, free },
    recentReferrals: recentReferrals.map((r) => ({
      id: String(r._id),
      leadName: r.leadName,
      createdAt: r.createdAt,
      from: (r.fromUserId as { name?: string } | undefined)?.name,
      to: (r.toUserId as { name?: string } | undefined)?.name,
    })),
  });
}
