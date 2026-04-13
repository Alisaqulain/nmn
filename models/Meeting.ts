import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const attendanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    present: { type: Boolean, default: false },
    markedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    markedAt: { type: Date, default: null },
  },
  { _id: false }
);

const meetingSchema = new Schema(
  {
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
    title: { type: String, default: "Weekly Chapter Meeting" },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, default: null },
    agenda: { type: String, default: "" },
    attendance: { type: [attendanceSchema], default: [] },
  },
  { timestamps: true }
);

meetingSchema.index({ chapterId: 1, startsAt: -1 });

export type MeetingDoc = InferSchemaType<typeof meetingSchema> & { _id: mongoose.Types.ObjectId };

export const Meeting: Model<MeetingDoc> =
  mongoose.models.Meeting ?? mongoose.model<MeetingDoc>("Meeting", meetingSchema);
