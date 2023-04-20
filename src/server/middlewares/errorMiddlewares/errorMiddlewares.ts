import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import {
  errorsManagerCodes,
  errorsManagerMessages,
} from "../../../errorsManager/errorsManager";
import createDebug from "debug";

const debug = createDebug("bikemeet:server:middlewares:errorMiddlewares:*");

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError = new CustomError(
    errorsManagerMessages.notFoundDev,
    errorsManagerCodes.notFound,
    errorsManagerMessages.notFoundUser
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
    error.publicMessage || errorsManagerMessages.publicMessageDefault;

  res.status(statusCode).json({ error: publicMessage });
};
