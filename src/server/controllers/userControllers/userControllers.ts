import "../../../loadEnvironment.js";
import { type NextFunction, type Request, type Response } from "express";
import {
  type UserToVerifyStructure,
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
import sendVerificationEmail from "../../../utils/verifyEmail/sendVerificationEmail.js";

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

    const token = jwt.sign(email, process.env.JWT_SECRET!);

    const user = await UserModel.create({
      email,
      name,
      password: hashedPassword,
      surname,
      username,
      confirmationCode: token,
    });

    await sendVerificationEmail(user);

    res
      .status(usersPositiveStatusCodes.created)
      .json({ confirmationCode: user.confirmationCode });
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

export const verifyEmail = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserToVerifyStructure
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmationCode } = req.body;

    if (!confirmationCode) {
      throw new Error();
    }

    const userToVerify = await UserModel.findOne({ confirmationCode }).exec();

    if (!userToVerify) {
      throw new Error();
    }

    userToVerify.confirmationCode = undefined;
    userToVerify.isVerified = true;

    await userToVerify.save();

    res
      .status(usersPositiveStatusCodes.responseOk)
      .json({ user: userToVerify });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.notFound,
      errorsManagerMessages.verificationMailError
    );

    next(customError);
  }
};

export const findUserEmail = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email }).exec();

    if (!user) {
      throw new Error();
    }

    res.status(usersPositiveStatusCodes.responseOk).json({
      isVerified: user.isVerified,
      sub: (user._id as string).toString(),
    });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.notFound,
      errorsManagerMessages.getUserWrongEmail
    );

    next(customError);
  }
};

export const recoveryPassword = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const { userId } = req.params;

  const hashingPasswordLength = 10;

  try {
    const hashedPassword = await bcryptjs.hash(password, hashingPasswordLength);

    const user = await UserModel.findById({ _id: userId }).exec();

    if (!user) {
      throw new Error();
    }

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: userPositiveFeedback.passwordChanged });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.notFound,
      errorsManagerMessages.passwordRecoveryError
    );

    next(customError);
  }
};
