import { type Request } from "express";
import type * as core from "express-serve-static-core";

export enum SurfaceTypeOptions {
  Gravel = "Gravel",
  Road = "Road",
  Mtb = "Mountain",
}

export enum DifficultyOption {
  Easy = "Easy",
  Intermediate = "Intermediate",
  Hard = "Hard",
  Expert = "Expert",
}

export interface RideDataStructure {
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
  rideId?: string;
}

export type RidesDataStructure = RideDataStructure[];
export interface CustomRideRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  rideId: string;
}
