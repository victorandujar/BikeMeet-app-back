import { type NextFunction, type Request, type Response } from "express";
import { Ride } from "../../../database/models/Ride.js";
import { positiveFeedbackStatusCodes } from "../../../utils/feedbackMessages/positiveFeedbackManager/positiveFeedbackManager.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  ridesErrorsManagerStructure,
  userErrorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsFeedbackManager/errorsFeedbackManager.js";

export const getAllRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rides = await Rides.find()
      .populate("owner", "name surname username rides rate image")
      .exec();

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId).exec();

    if (!ride) {
      const error = new CustomError(
        ridesErrorsManagerStructure.notFoundRide,
        errorsManagerCodes.notFound,
        ridesErrorsManagerStructure.notFoundRide
      );

      next(error);

      return;
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
