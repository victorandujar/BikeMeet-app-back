import { Router } from "express";
import { ridesEndpoints } from "../../../utils/endpoints/endpoints.js";
import {
  getAllRides,
  getRideById,
  createRide,
} from "../../controllers/ridesControllers/ridesControllers.js";
import multer from "multer";
import path from "path";
import imageBackup from "../../middlewares/images/imageBackup.js";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, callBack) {
    const suffix = crypto.randomUUID();

    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);

    const filename = `${basename}-${suffix}${extension}`;

    callBack(null, filename);
  },
});

const upload = multer({ storage, limits: { fileSize: 10000000 } });

const ridesRouter = Router();

ridesRouter.get(ridesEndpoints.getAllRides, getAllRides);
ridesRouter.get(ridesEndpoints.detail, getRideById);
ridesRouter.post(
  ridesEndpoints.create,
  upload.single("image"),
  imageBackup,
  createRide
);

export default ridesRouter;
