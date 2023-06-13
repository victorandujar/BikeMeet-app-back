import { Router } from "express";
import { ridesEndpoints } from "../../../utils/endpoints/endpoints.js";
import { getAllRides } from "../../controllers/ridesControllers/ridesControllers.js";

const ridesRouter = Router();

ridesRouter.get(ridesEndpoints.getAllRides, getAllRides);

export default ridesRouter;
