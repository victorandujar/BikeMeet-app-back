import { type Document, Schema, model, type InferSchemaType } from "mongoose";
import {
  type DifficultyOption,
  type SurfaceTypeOptions,
} from "../../server/controllers/ridesControllers/types/types";

export interface RideModel extends Document {
  title: string;
  location: string;
  elevationGain: number;
  date: Date | string;
  surfaceType: SurfaceTypeOptions;
  distance: number;
  difficulty: DifficultyOption;
  pace: number;
  description: string;
  ridersJoined: string[];
  ridersLimit: number;
  image: string;
  map: string;
  owner: Record<string, unknown> | string;
}

const rideSchema = new Schema<RideModel>({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  elevationGain: {
    type: Number,
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
  map: {
    type: String,
  },
});

export const Ride = model<RideModel>("Ride", rideSchema, "rides");

export type RideSchemaStructure = InferSchemaType<typeof rideSchema>;
