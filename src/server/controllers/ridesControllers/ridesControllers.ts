import { type NextFunction, type Request, type Response } from "express";
import {
  Ride,
  type RideSchemaStructure,
} from "../../../database/models/Ride.js";
import { positiveFeedbackStatusCodes } from "../../../utils/feedbackMessages/positiveFeedbackManager/positiveFeedbackManager.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  ridesErrorsManagerStructure,
  userErrorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsFeedbackManager/errorsFeedbackManager.js";
import { type CustomRideRequest } from "./types/types.js";

export const getAllRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rides = await Ride.find()
      .populate("owner", "name surname username rides rate image")
      .exec();

    if (!rides) {
      throw new Error();
    }

    res.status(positiveFeedbackStatusCodes.responseOk).json({ rides });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.notFound,
      ridesErrorsManagerStructure.notFoundRides
    );

    next(customError);
  }
};

export const getRideById = async (
  req: CustomRideRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById({ _id: rideId }).exec();

    if (!ride) {
      throw new Error();
    }

    res.status(positiveFeedbackStatusCodes.responseOk).json({ ride });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.generalErrorStatusCode,
      userErrorsManagerMessages.publicMessageDefault
    );

    next(customError);
  }
};

export const createRide = async (
  req: CustomRideRequest,
  res: Response,
  next: NextFunction
) => {
  const ride = req.body as RideSchemaStructure;

  try {
    const newRide = await Ride.create({
      ...ride,
    });

    res
      .status(positiveFeedbackStatusCodes.created)
      .json({ ...newRide.toJSON() });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.generalErrorStatusCode,
      ridesErrorsManagerStructure.notCreatedRide
    );
    next(customError);
  }
};
