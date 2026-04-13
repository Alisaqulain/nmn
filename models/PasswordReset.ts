import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const passwordResetSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type PasswordResetDoc = InferSchemaType<typeof passwordResetSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const PasswordReset: Model<PasswordResetDoc> =
  mongoose.models.PasswordReset ??
  mongoose.model<PasswordResetDoc>("PasswordReset", passwordResetSchema);
