import { type NextFunction, type Request, type Response } from "express";
import { type UserRegisterCredentials } from "./types/types";
import { UserModel } from "../../../database/models/User.js";
import bcryptjs from "bcryptjs";
import { userPositiveFeedback } from "../../../utils/feedbackMessages/userPositiveFeedback/userPositiveFeedback.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  errorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsManager/errorsManager.js";

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const hashingPasswordLength = 10;
  const { email, name, password, surname, username } = req.body;

  try {
    const hashedPassword = await bcryptjs.hash(password, hashingPasswordLength);

    await UserModel.create({
      email,
      name,
      password: hashedPassword,
      surname,
      username,
    });

    res.status(201).json({ message: userPositiveFeedback.userCreatedMessage });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.registerErrorStatusCode,
      errorsManagerMessages.registerPublicMessage
    );

    next(customError);
  }
};
