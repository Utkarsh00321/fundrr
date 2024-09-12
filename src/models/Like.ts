import { Schema, model, models, Model, Document, Types } from "mongoose";

export interface ILike extends Document {
  user: Types.ObjectId; // Reference to the user who liked the idea
  idea: Types.ObjectId; // Reference to the liked idea
}

const LikeSchema = new Schema<ILike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idea: {
      type: Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// Prevent model recompilation issue in Next.js
const Like: Model<ILike> = models.Like || model<ILike>("Like", LikeSchema);

export default Like;
