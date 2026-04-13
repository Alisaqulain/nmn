import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const chapterSchema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    meetingDay: { type: String, default: "Tuesday" },
    meetingTime: { type: String, default: "7:00 AM" },
    venueAddress: { type: String, default: "" },
    venueName: { type: String, default: "" },
  },
  { timestamps: true }
);

export type ChapterDoc = InferSchemaType<typeof chapterSchema> & { _id: mongoose.Types.ObjectId };

export const Chapter: Model<ChapterDoc> =
  mongoose.models.Chapter ?? mongoose.model<ChapterDoc>("Chapter", chapterSchema);
