import { Router } from "express";
import { ridesEndpoints } from "../../../utils/endpoints/endpoints.js";
import {
  getAllRides,
  getRideById,
} from "../../controllers/ridesControllers/ridesControllers.js";

const ridesRouter = Router();

ridesRouter.get(ridesEndpoints.getAllRides, getAllRides);
ridesRouter.get(ridesEndpoints.detail, getRideById);

export default ridesRouter;
