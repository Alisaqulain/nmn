import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const testimonialSchema = new Schema(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type TestimonialDoc = InferSchemaType<typeof testimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Testimonial: Model<TestimonialDoc> =
  mongoose.models.Testimonial ?? mongoose.model<TestimonialDoc>("Testimonial", testimonialSchema);
