import { Schema, model, type Document } from "mongoose";

interface UserModel extends Document {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  confirmationCode: string | undefined;
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
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  confirmationCode: {
    type: String,
  },
});

export const User = model<UserModel>("User", UserSchema, "users");
