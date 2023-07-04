import { Router } from "express";
import { ridesEndpoints } from "../../../utils/endpoints/endpoints.js";
import {
  getAllRides,
  getRideById,
  createRide,
} from "../../controllers/ridesControllers/ridesControllers.js";

const ridesRouter = Router();

ridesRouter.get(ridesEndpoints.getAllRides, getAllRides);
ridesRouter.get(ridesEndpoints.detail, getRideById);
ridesRouter.post(ridesEndpoints.create, createRide);

export default ridesRouter;
