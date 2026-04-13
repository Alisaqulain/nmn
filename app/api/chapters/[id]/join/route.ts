import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { Chapter } from "@/models/Chapter";
import { User } from "@/models/User";
import { createNotification } from "@/lib/notify";

const bodySchema = z.object({
  category: z.string().min(1),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.plan !== "premium") {
    return NextResponse.json({ error: "Premium membership required to join chapters" }, { status: 403 });
  }
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }
  const { category } = parsed.data;
  await connectDB();
  const chapter = await Chapter.findById(id);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }
  const taken = await User.findOne({
    chapterId: chapter._id,
    category: new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
    _id: { $ne: session.sub },
  });
  if (taken) {
    return NextResponse.json(
      { error: "This category is already represented in this chapter. Choose another specialty." },
      { status: 409 }
    );
  }
  await User.findByIdAndUpdate(session.sub, {
    $set: { chapterId: chapter._id, category },
  });
  await createNotification(
    session.sub,
    "Chapter joined",
    `You joined ${chapter.name} in ${chapter.city}.`,
    "system"
  );
  return NextResponse.json({ message: "Joined chapter", chapterId: String(chapter._id) });
}
