import { type Document, Schema, model } from "mongoose";

export interface RidesModel extends Document {
  title: string;
  location: string;
  date: string;
  surfaceType: string;
  distance: string;
  difficulty: string;
  pace: string;
  description: string;
  ridersJoined: string;
  ridersLimit: number;
  image: string;
  owner: Record<string, unknown>;
}

const ridesSchecma = new Schema<RidesModel>({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  surfaceType: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  pace: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ridersJoined: {
    type: String,
  },
  ridersLimit: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Rides = model<RidesModel>("Rides", ridesSchecma, "rides");
