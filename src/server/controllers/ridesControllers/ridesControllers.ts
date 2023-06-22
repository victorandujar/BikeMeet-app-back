import { type NextFunction, type Request, type Response } from "express";
import { Rides } from "../../../database/models/Rides.js";
import { positiveFeedbackStatusCodes } from "../../../utils/feedbackMessages/positiveFeedbackManager/positiveFeedbackManager.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  ridesErrorsManagerStructure,
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
