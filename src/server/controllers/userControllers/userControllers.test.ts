import { type NextFunction, type Request, type Response } from "express";
import {
  type UserCredentials,
  type UserRegisterCredentials,
} from "./types/types";
import bcryptjs from "bcryptjs";
import { UserModel } from "../../../database/models/User.js";
import {
  findUserEmail,
  loginUser,
  recoveryPassword,
  registerUser,
} from "./userControllers.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  errorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsManager/errorsManager.js";
import {
  mockUserLoginCredentials,
  mockUserRegisterCredentials,
} from "../../../mocks/usersMocks/usersMocks";
import {
  userPositiveFeedback,
  usersPositiveStatusCodes,
} from "../../../utils/feedbackMessages/userPositiveFeedback/userPositiveFeedback";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../../../utils/verifyEmail/sendVerificationEmail";

const req: Partial<
  Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >
> = {};
const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();

jest.mock("../../../utils/verifyEmail/sendVerificationEmail.js");
const mockVerificationEmail = sendVerificationEmail as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe("Given a registerUser controller", () => {
  describe("When it receives a request", () => {
    test("Then it should call its status method with 201 status code and its json method with the confirmationCode", async () => {
      const jsonMessage = { confirmationCode: "kdjfkldsjfklasdf" };

      req.body = mockUserRegisterCredentials;
      bcryptjs.hash = jest.fn().mockResolvedValue("vik27634fvj");
      jwt.sign = jest.fn().mockReturnValue("kdjfkldsjfklasdf");

      UserModel.create = jest
        .fn()
        .mockResolvedValue(mockUserRegisterCredentials);

      mockVerificationEmail();

      await registerUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserRegisterCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(usersPositiveStatusCodes.created);
      expect(res.json).toHaveBeenCalledWith(jsonMessage);
    });
  });

  describe("When it receives a user with an invalid password length", () => {
    test("Then it should show an error with the text 'The user couldn't be created. Try again!'", async () => {
      const expectedError = new CustomError(
        errorsManagerMessages.registerPublicMessage,
        errorsManagerCodes.registerErrorStatusCode,
        errorsManagerMessages.registerPublicMessage
      );

      req.body = mockUserRegisterCredentials;
      jwt.sign = jest.fn().mockReturnValue("kdjfkldsjfklasdf");
      UserModel.create = jest
        .fn()
        .mockRejectedValue(
          new Error(errorsManagerMessages.registerPublicMessage)
        );

      await registerUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserRegisterCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a loginUser controller", () => {
  const req: Partial<
    Request<Record<string, unknown>, Record<string, unknown>, UserCredentials>
  > = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  describe("When it receives a request", () => {
    test("Then it should call its status method with 200 and its json method with the property token", async () => {
      req.body = mockUserLoginCredentials;
      const expectedResponse = { token: "dsjakhsdsagdhgashj" };

      UserModel.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUserLoginCredentials,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcryptjs.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("dsjakhsdsagdhgashj");

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(
        usersPositiveStatusCodes.responseOk
      );
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives bad user credentials", () => {
    test("Then it should show an error with the text 'Wrong credentials' and call next", async () => {
      const expectedError = new CustomError(
        errorsManagerMessages.wrongCredentialsMessage,
        errorsManagerCodes.wrongCredentialsStatusCode,
        errorsManagerMessages.wrongCredentialsMessage
      );

      req.body = mockUserLoginCredentials;

      UserModel.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(expectedError),
      }));

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getUserCheckVerified controller", () => {
  const req: Partial<
    Request<Record<string, unknown>, Record<string, unknown>, UserCredentials>
  > = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  describe("When it receives a request to check if an email is verified and the user exists", () => {
    test("Then it should call its stauts method with 200 and its json method with the value of the property isVerified", async () => {
      const expectedResponse = {
        isVerified: false,
        sub: "dfjkdfjklasdjklfjdsalkf",
      };
      req.body = mockUserLoginCredentials;

      UserModel.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUserRegisterCredentials,
          _id: expectedResponse.sub,
        }),
      }));

      await findUserEmail(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(
        usersPositiveStatusCodes.responseOk
      );
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives bad user credentials", () => {
    test("Then it should show an error with the text 'Wrong credentials' and call next", async () => {
      const expectedError = new CustomError(
        errorsManagerMessages.getUserWrongEmail,
        errorsManagerCodes.notFound,
        errorsManagerMessages.getUserWrongEmail
      );

      req.body = mockUserLoginCredentials;

      UserModel.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(expectedError),
      }));

      await findUserEmail(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a recoveryPassword controller", () => {
  const req: Partial<
    Request<Record<string, unknown>, Record<string, unknown>, UserCredentials>
  > = { params: { userId: "dsfjkhdskfhdskfhfdksjfhjdshfk" } };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();
  describe("When it receives a request with a new password and the user exists", () => {
    test("Then it should respond with status 200 and the message 'User password has been modified correctly!'", async () => {
      const expectedResponse = {
        message: userPositiveFeedback.passwordChanged,
      };
      req.body = mockUserLoginCredentials;

      const user = {
        _id: "1234567890",
        password: "sdfhjdksfhdjksfhdsjk",
        save: jest.fn(),
      };

      UserModel.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(user),
      }));

      await recoveryPassword(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(
        usersPositiveStatusCodes.responseOk
      );
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives bad user email", () => {
    test("Then it should show an error with the text 'We couldn't restore your password. Please try again' and call next", async () => {
      const expectedError = new CustomError(
        errorsManagerMessages.passwordRecoveryError,
        errorsManagerCodes.notFound,
        errorsManagerMessages.passwordRecoveryError
      );

      req.body = mockUserLoginCredentials;

      UserModel.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue({
          message: errorsManagerMessages.passwordRecoveryError,
        }),
        save: jest.fn().mockRejectedValue(expectedError),
      }));

      await recoveryPassword(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
