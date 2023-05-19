import { type Request, type Response } from "express";
import {
  type UserCredentials,
  type UserRegisterCredentials,
} from "./types/types";
import bcryptjs from "bcryptjs";
import { UserModel } from "../../../database/models/User.js";
import { loginUser, registerUser } from "./userControllers.js";
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

beforeEach(() => jest.clearAllMocks());

describe("Given a registerUser controller", () => {
  describe("When it receives a request", () => {
    test("Then it should call its status method with 201 status code and its json method with the message 'The user has been created'", async () => {
      const jsonMessage = { message: userPositiveFeedback.userCreatedMessage };

      req.body = mockUserRegisterCredentials;
      bcryptjs.hash = jest.fn().mockResolvedValue("vik27634fvj");
      UserModel.create = jest
        .fn()
        .mockResolvedValue(mockUserRegisterCredentials);

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
