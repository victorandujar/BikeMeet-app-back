import { type Document, Schema, model } from "mongoose";
import {
  type DifficultyOption,
  type SurfaceTypeOptions,
} from "../../server/controllers/ridesControllers/types/types";

export interface RidesModel extends Document {
  title: string;
  location: string;
  date: string | Date;
  surfaceType: SurfaceTypeOptions;
  distance: number;
  difficulty: DifficultyOption;
  pace: number;
  description: string;
  ridersJoined: string[];
  ridersLimit: number;
  image: string;
  owner: Record<string, unknown> | string;
}

const ridesSchema = new Schema<RidesModel>({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  surfaceType: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  pace: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ridersJoined: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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

export const Rides = model<RidesModel>("Rides", ridesSchema, "rides");
