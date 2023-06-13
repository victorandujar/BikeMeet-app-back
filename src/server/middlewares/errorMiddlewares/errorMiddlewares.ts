import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  userErrorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsFeedbackManager/errorsFeedbackManager.js";
import createDebug from "debug";

const debug = createDebug("bikemeet:server:middlewares:errorMiddlewares:*");

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError = new CustomError(
    userErrorsManagerMessages.notFoundDev,
    errorsManagerCodes.notFound,
    userErrorsManagerMessages.notFoundUser
  );

  next(customError);
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(error.message);

  const statusCode =
    error.statusCode || errorsManagerCodes.generalErrorStatusCode;
  const publicMessage =
    error.publicMessage || userErrorsManagerMessages.publicMessageDefault;

  res.status(statusCode).json({ error: publicMessage });
};
