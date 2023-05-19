import "../../../loadEnvironment.js";
import { type NextFunction, type Request, type Response } from "express";
import {
  type CustomJwtPayload,
  type UserCredentials,
  type UserRegisterCredentials,
} from "./types/types";
import { UserModel } from "../../../database/models/User.js";
import bcryptjs from "bcryptjs";
import {
  userPositiveFeedback,
  usersPositiveStatusCodes,
} from "../../../utils/feedbackMessages/userPositiveFeedback/userPositiveFeedback.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  errorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsManager/errorsManager.js";
import jwt from "jsonwebtoken";

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

    res
      .status(usersPositiveStatusCodes.created)
      .json({ message: userPositiveFeedback.userCreatedMessage });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.registerErrorStatusCode,
      errorsManagerMessages.registerPublicMessage
    );

    next(customError);
  }
};

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).exec();

    if (!user) {
      throw new Error();
    }

    const passwordConfirmation = await bcryptjs.compare(
      password,
      user.password
    );

    if (!passwordConfirmation) {
      throw new Error();
    }

    const jwtPayload: CustomJwtPayload = {
      sub: (user._id as string).toString(),
      email,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(usersPositiveStatusCodes.responseOk).json({ token });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.wrongCredentialsStatusCode,
      errorsManagerMessages.wrongCredentialsMessage
    );

    next(customError);
  }
};
