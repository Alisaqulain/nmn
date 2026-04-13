import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { User } from "@/models/User";
import { Chapter } from "@/models/Chapter";
import { Referral } from "@/models/Referral";
import { Meeting } from "@/models/Meeting";
import { Event } from "@/models/Event";
import { Testimonial } from "@/models/Testimonial";
import { Notification } from "@/models/Notification";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    const hdr = req.headers.get("x-seed-secret");
    if (!process.env.SEED_SECRET || hdr !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  await connectDB();
  await Promise.all([
    User.deleteMany({ email: { $regex: /@nmn\.demo$/ } }),
    Chapter.deleteMany({ slug: { $regex: /^demo-/ } }),
    Referral.deleteMany({}),
    Meeting.deleteMany({}),
    Event.deleteMany({}),
    Testimonial.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  const adminPass = await hashPassword("Admin123!");
  const memberPass = await hashPassword("Member123!");
  const admin = await User.create({
    email: "admin@nmn.demo",
    passwordHash: adminPass,
    role: "admin",
    plan: "premium",
    name: "Alexandra Cole",
    emailVerified: true,
    businessName: "NMN HQ",
    category: "Leadership",
    phone: "+1 555-0100",
    bio: "National director for NMN chapters.",
    location: "New York, NY",
  });
  const mumbai = await Chapter.create({
    name: "NMN Mumbai Central",
    city: "Mumbai",
    slug: "demo-mumbai-central",
    description: "Flagship chapter for finance, real estate, and professional services.",
    meetingDay: "Tuesday",
    meetingTime: "7:00 AM IST",
    venueName: "The Oberoi Business Centre",
    venueAddress: "Nariman Point, Mumbai",
  });
  const delhi = await Chapter.create({
    name: "NMN Delhi NCR",
    city: "Delhi",
    slug: "demo-delhi-ncr",
    description: "High-trust referrals across NCR enterprises.",
    meetingDay: "Wednesday",
    meetingTime: "8:00 AM IST",
    venueName: "Connaught Place Executive Club",
    venueAddress: "Connaught Place, New Delhi",
  });
  const members = await User.insertMany([
    {
      email: "riya@nmn.demo",
      passwordHash: memberPass,
      role: "member",
      plan: "premium",
      name: "Riya Mehta",
      businessName: "Mehta Wealth Partners",
      category: "Financial Advisor",
      phone: "+91 90000 11111",
      bio: "Helping founders structure long-term wealth.",
      location: "Mumbai",
      chapterId: mumbai._id,
      emailVerified: true,
    },
    {
      email: "vikram@nmn.demo",
      passwordHash: memberPass,
      role: "member",
      plan: "premium",
      name: "Vikram Singh",
      businessName: "Singh Realty Group",
      category: "Real Estate",
      phone: "+91 90000 22222",
      bio: "Commercial and luxury residential advisory.",
      location: "Mumbai",
      chapterId: mumbai._id,
      emailVerified: true,
    },
    {
      email: "ananya@nmn.demo",
      passwordHash: memberPass,
      role: "member",
      plan: "free",
      name: "Ananya Kapoor",
      businessName: "Kapoor Legal",
      category: "Attorney",
      phone: "+91 90000 33333",
      bio: "Corporate counsel for growth-stage companies.",
      location: "Delhi",
      chapterId: delhi._id,
      emailVerified: true,
    },
  ]);
  const [riya, vikram] = members;
  await Referral.create({
    chapterId: mumbai._id,
    fromUserId: riya._id,
    toUserId: vikram._id,
    leadName: "Patel Manufacturing expansion",
    leadContact: "patel@example.com",
    notes: "Looking for industrial space in BKC.",
    status: "open",
  });
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(7, 0, 0, 0);
  const mumbaiMemberIds = await User.find({ chapterId: mumbai._id }).select("_id").lean();
  await Meeting.create({
    chapterId: mumbai._id,
    title: "Weekly Chapter Meeting",
    startsAt: nextWeek,
    agenda: "10-minute presentations, referrals round, guest speaker.",
    attendance: mumbaiMemberIds.map((u) => ({
      userId: u._id,
      present: false,
    })),
  });
  await Event.create({
    title: "Referral Mastery Workshop",
    description: "Full-day training on BNI-style referral systems and follow-up.",
    startsAt: new Date(Date.now() + 86400000 * 14),
    endsAt: new Date(Date.now() + 86400000 * 14 + 3600000 * 8),
    location: "NMN Virtual + Mumbai Studio",
    capacity: 120,
    registrations: [riya._id],
    createdBy: admin._id,
  });
  await Testimonial.create({
    fromUserId: vikram._id,
    toUserId: riya._id,
    content:
      "Riya has been instrumental in connecting our clients with the right tax and compliance partners. Highly trusted partner in the chapter.",
    rating: 5,
  });
  return NextResponse.json({
    ok: true,
    credentials: {
      admin: { email: "admin@nmn.demo", password: "Admin123!" },
      memberPremium: { email: "riya@nmn.demo", password: "Member123!" },
      memberFree: { email: "ananya@nmn.demo", password: "Member123!" },
    },
  });
}
