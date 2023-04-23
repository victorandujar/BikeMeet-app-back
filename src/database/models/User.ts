import { Schema, model, type Document } from "mongoose";

interface User extends Document {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
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
});

export const UserModel = model<User>("User", UserSchema, "users");
