import { Schema, model, type Document } from "mongoose";

interface User extends Document {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  confirmationCode: string | undefined;
}

const UserSchema = new Schema<User>({
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

export const UserModel = model<User>("User", UserSchema, "users");
