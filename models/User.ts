import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    emailVerified: { type: Boolean, default: false },
    name: { type: String, default: "" },
    businessName: { type: String, default: "" },
    category: { type: String, default: "" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    location: { type: String, default: "" },
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", default: null },
  },
  { timestamps: true }
);

userSchema.index({ chapterId: 1, category: 1 });

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

export const User: Model<UserDoc> =
  mongoose.models.User ?? mongoose.model<UserDoc>("User", userSchema);
