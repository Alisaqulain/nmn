import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const referralSchema = new Schema(
  {
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", default: null },
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    leadName: { type: String, required: true },
    leadContact: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["open", "won", "lost"], default: "open" },
  },
  { timestamps: true }
);

referralSchema.index({ fromUserId: 1 });
referralSchema.index({ toUserId: 1 });

export type ReferralDoc = InferSchemaType<typeof referralSchema> & { _id: mongoose.Types.ObjectId };

export const Referral: Model<ReferralDoc> =
  mongoose.models.Referral ?? mongoose.model<ReferralDoc>("Referral", referralSchema);
