import { Schema, model, models, Model, Document, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  idea: Types.ObjectId;
  user: Types.ObjectId;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    idea: {
      type: Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent model recompilation issue in Next.js
const Comment: Model<IComment> =
  models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
