import "../../../loadEnvironment.js";
import { type NextFunction, type Request, type Response } from "express";
import {
  type UserToVerifyStructure,
  type CustomJwtPayload,
  type UserCredentials,
  type UserRegisterCredentials,
  type UserDataStructure,
} from "./types/types";
import { User } from "../../../database/models/User.js";
import bcryptjs from "bcryptjs";
import {
  positiveFeedbackMessages,
  positiveFeedbackStatusCodes,
} from "../../../utils/feedbackMessages/positiveFeedbackManager/positiveFeedbackManager.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  userErrorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsFeedbackManager/errorsFeedbackManager.js";
import jwt from "jsonwebtoken";
import {
  sendRecoveryPasswordEmail,
  sendVerificationUserEmail,
} from "../../../utils/verifyEmail/sendVerificationEmails.js";

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

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      surname,
      username,
      confirmationCode: token,
    });

    await sendVerificationUserEmail(user);

    res
      .status(positiveFeedbackStatusCodes.created)
      .json({ confirmationCode: user.confirmationCode });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.registerErrorStatusCode,
      userErrorsManagerMessages.registerPublicMessage
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
    const user = await User.findOne({ email }).select("+password").exec();

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

    res.status(positiveFeedbackStatusCodes.responseOk).json({ token });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.wrongCredentialsStatusCode,
      userErrorsManagerMessages.wrongCredentialsMessage
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

    const userToVerify = await User.findOne({ confirmationCode }).exec();

    if (!userToVerify) {
      throw new Error();
    }

    userToVerify.confirmationCode = undefined;
    userToVerify.isVerified = true;

    await userToVerify.save();

    res
      .status(positiveFeedbackStatusCodes.responseOk)
      .json({ user: userToVerify });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.notFound,
      userErrorsManagerMessages.verificationMailError
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
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new Error();
    }

    res.status(positiveFeedbackStatusCodes.responseOk).json({
      isVerified: user.isVerified,
    });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.notFound,
      userErrorsManagerMessages.getUserWrongEmail
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

    const user = await User.findById({ _id: userId }).exec();

    if (!user) {
      throw new Error();
    }

    user.password = hashedPassword;
    await user.save();

    res
      .status(positiveFeedbackStatusCodes.responseOk)
      .json({ message: positiveFeedbackMessages.passwordChanged });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.notFound,
      userErrorsManagerMessages.passwordRecoveryError
    );

    next(customError);
  }
};

export const findUserToRestorePassword = async (
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
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new Error();
    }

    await sendRecoveryPasswordEmail(user, (user._id as string).toString());

    res.status(positiveFeedbackStatusCodes.responseOk).json({
      message: positiveFeedbackMessages.userFound,
    });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.notFound,
      userErrorsManagerMessages.getUserWrongEmail
    );

    next(customError);
  }
};

export const getUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserDataStructure
  >,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new Error();
    }

    res.status(positiveFeedbackStatusCodes.responseOk).json({ user });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      errorsManagerCodes.notFound,
      userErrorsManagerMessages.notFoundUser
    );

    next(customError);
  }
};
