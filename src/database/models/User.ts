import { Schema, model, type Document } from "mongoose";

interface UserModel extends Document {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  confirmationCode: string | undefined;
  followers: string[];
  following: string[];
  rides: number;
  rate: number;
  image: string;
  location: string;
}

const UserSchema = new Schema<UserModel>({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  confirmationCode: {
    type: String,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  rides: {
    type: Number,
    default: 0,
  },
  rate: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
  },
});

export const User = model<UserModel>("User", UserSchema, "users");
