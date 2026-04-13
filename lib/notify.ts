import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";
import type mongoose from "mongoose";

export async function createNotification(
  userId: mongoose.Types.ObjectId | string,
  title: string,
  message: string,
  type: "info" | "referral" | "meeting" | "event" | "system" = "info"
) {
  await connectDB();
  await Notification.create({ userId, title, message, type });
}
