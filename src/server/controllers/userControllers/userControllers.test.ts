import { type NextFunction, type Request, type Response } from "express";
import {
  type UserDataStructure,
  type UserCredentials,
  type UserRegisterCredentials,
} from "./types/types";
import bcryptjs from "bcryptjs";
import { User } from "../../../database/models/User.js";
import {
  findUserEmail,
  getUser,
  loginUser,
  recoveryPassword,
  registerUser,
} from "./userControllers.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  userErrorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsFeedbackManager/errorsFeedbackManager.js";
import {
  mockUserData,
  mockUserLoginCredentials,
  mockUserRegisterCredentials,
} from "../../../mocks/usersMocks/usersMocks";
import {
  positiveFeedbackMessages,
  positiveFeedbackStatusCodes,
} from "../../../utils/feedbackMessages/positiveFeedbackManager/positiveFeedbackManager";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { sendVerificationUserEmail } from "../../../utils/verifyEmail/sendVerificationEmails";

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

jest.mock("../../../utils/verifyEmail/sendVerificationEmails");
const mockVerificationEmail = sendVerificationUserEmail as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe("Given a registerUser controller", () => {
  describe("When it receives a request", () => {
    test("Then it should call its status method with 201 status code and its json method with the confirmationCode", async () => {
      const jsonMessage = { confirmationCode: "kdjfkldsjfklasdf" };

      req.body = mockUserRegisterCredentials;
      bcryptjs.hash = jest.fn().mockResolvedValue("vik27634fvj");
      jwt.sign = jest.fn().mockReturnValue("kdjfkldsjfklasdf");

      User.create = jest.fn().mockResolvedValue(mockUserRegisterCredentials);

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

      expect(res.status).toHaveBeenCalledWith(
        positiveFeedbackStatusCodes.created
      );
      expect(res.json).toHaveBeenCalledWith(jsonMessage);
    });
  });

  describe("When it receives a user with an invalid password length", () => {
    test("Then it should show an error with the text 'The user couldn't be created. Try again!'", async () => {
      const expectedError = new CustomError(
        userErrorsManagerMessages.registerPublicMessage,
        errorsManagerCodes.registerErrorStatusCode,
        userErrorsManagerMessages.registerPublicMessage
      );

      req.body = mockUserRegisterCredentials;
      jwt.sign = jest.fn().mockReturnValue("kdjfkldsjfklasdf");
      User.create = jest
        .fn()
        .mockRejectedValue(
          new Error(userErrorsManagerMessages.registerPublicMessage)
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

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
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
        positiveFeedbackStatusCodes.responseOk
      );
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives bad user credentials", () => {
    test("Then it should show an error with the text 'Wrong credentials' and call next", async () => {
      const expectedError = new CustomError(
        userErrorsManagerMessages.wrongCredentialsMessage,
        errorsManagerCodes.wrongCredentialsStatusCode,
        userErrorsManagerMessages.wrongCredentialsMessage
      );

      req.body = mockUserLoginCredentials;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
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

describe("Given a findUserEmail controller", () => {
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
      };
      req.body = mockUserLoginCredentials;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUserRegisterCredentials,
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
        positiveFeedbackStatusCodes.responseOk
      );
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives bad user credentials", () => {
    test("Then it should show an error with the text 'Wrong credentials' and call next", async () => {
      const expectedError = new CustomError(
        userErrorsManagerMessages.getUserWrongEmail,
        errorsManagerCodes.notFound,
        userErrorsManagerMessages.getUserWrongEmail
      );

      req.body = mockUserLoginCredentials;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
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
        message: positiveFeedbackMessages.passwordChanged,
      };
      req.body = mockUserLoginCredentials;

      const user = {
        _id: "1234567890",
        password: "sdfhjdksfhdjksfhdsjk",
        save: jest.fn(),
      };

      User.findById = jest.fn().mockImplementationOnce(() => ({
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
        positiveFeedbackStatusCodes.responseOk
      );
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives bad user email", () => {
    test("Then it should show an error with the text 'We couldn't restore your password. Please try again' and call next", async () => {
      const expectedError = new CustomError(
        userErrorsManagerMessages.passwordRecoveryError,
        errorsManagerCodes.notFound,
        userErrorsManagerMessages.passwordRecoveryError
      );

      req.body = mockUserLoginCredentials;

      User.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue({
          message: userErrorsManagerMessages.passwordRecoveryError,
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

describe("Given a getUser controller", () => {
  const req: Partial<
    Request<Record<string, unknown>, Record<string, unknown>, UserDataStructure>
  > = { params: { userId: "dsfjkhdskfhdskfhfdksjfhjdshfk" } };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();
  describe("When it receives a request with the user email", () => {
    test("Then it should respond with status 200 and its json method with the user", async () => {
      const expectedResponse = {
        user: mockUserData,
      };

      req.body = mockUserData;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUserData,
        }),
      }));

      await getUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserDataStructure
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(
        positiveFeedbackStatusCodes.responseOk
      );
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call its next method with a custom error", async () => {
      const expectedError = new CustomError(
        userErrorsManagerMessages.notFoundUser,
        errorsManagerCodes.wrongCredentialsStatusCode,
        userErrorsManagerMessages.notFoundUser
      );

      req.body = mockUserData;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(expectedError),
      }));

      await getUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserDataStructure
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
