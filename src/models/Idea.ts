import { Schema, model, models, Model, Document, Types } from "mongoose";

export interface IIdea extends Document {
  title: string;
  description: string;
  owner: Types.ObjectId;
  fundsRaised: number;
  goalAmount: number;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
}

const IdeaSchema = new Schema<IIdea>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fundsRaised: {
      type: Number,
      default: 0,
    },
    goalAmount: {
      type: Number,
      required: [true, "Goal amount is required"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Prevent model recompilation issue in Next.js
const Idea: Model<IIdea> = models.Idea || model<IIdea>("Idea", IdeaSchema);

export default Idea;
