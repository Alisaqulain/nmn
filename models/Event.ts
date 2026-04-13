import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    location: { type: String, default: "" },
    capacity: { type: Number, default: 100 },
    registrations: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export type EventDoc = InferSchemaType<typeof eventSchema> & { _id: mongoose.Types.ObjectId };

export const Event: Model<EventDoc> =
  mongoose.models.Event ?? mongoose.model<EventDoc>("Event", eventSchema);
