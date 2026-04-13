import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  businessName: z.string().optional(),
  category: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.union([z.string().url(), z.literal("")]).optional(),
  location: z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await req.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const user = await User.findByIdAndUpdate(session.sub, { $set: parsed.data }, { new: true }).lean();
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
      businessName: user.businessName,
      category: user.category,
      phone: user.phone,
      bio: user.bio,
      profileImage: user.profileImage,
      location: user.location,
    },
  });
}
