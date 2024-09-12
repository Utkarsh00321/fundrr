import { Schema, models, Model, model, Document, Types } from "mongoose";
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode: string;
  verificationCodeExpiry: Date;
  profilePicture?: string;
  bio?: string;
  ideas: Types.ObjectId[]; // References to posted ideas
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      required: [true, "Verify User"],
    },
    verificationCode: {
      type: String,
      required: [true, "Verification code required"],
    },
    verificationCodeExpiry: {
      type: Date,
      required: [true, "Verification code expiry required"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    ideas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Idea",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);
export default User;
