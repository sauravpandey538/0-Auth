import mongoose, { Schema, Document } from "mongoose";
import { MessageSchema } from "./message";
import { Message } from "./message";
interface UserModel {
  username: string;
  email: string;
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
  // sessionExpiry: Date;
}
const userSchema: Schema<UserModel> = new Schema({
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
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
  },
  verifyCode: {
    type: String,
    trim: true,
  },
  verifyCodeExpiry: {
    type: Date,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
  // sessionExpiry: {
  //   type: Date,
  //   default: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, //30 days
  // },
});

const User =
  (mongoose.models.User as mongoose.Model<UserModel>) ||
  mongoose.model<UserModel>("User", userSchema);

export default User;
