import { type Request, type Response } from "express";
import { type UserRegisterCredentials } from "../types/types";
import bcryptjs from "bcryptjs";
import { UserModel } from "../../../database/models/User.js";
import { registerUser } from "./userControllers.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  errorsManagerCodes,
  errorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsManager/errorsManager.js";

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
      const mockUser: UserRegisterCredentials = {
        email: "victor@andujar.org",
        password: "1234567890",
        name: "victor",
        surname: "Jhon",
        username: "ammavaru",
      };
      const jsonMessage = { message: "The user has been created!" };
      const statusCode = 201;

      req.body = mockUser;
      bcryptjs.hash = jest.fn().mockResolvedValue("vik27634fvj");
      UserModel.create = jest.fn().mockResolvedValue(mockUser);

      await registerUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserRegisterCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(jsonMessage);
    });
  });

  describe("When it receives a user with an invalid password length", () => {
    test("Then it should show an error with the text 'The user couldn't be created. Try again!'", async () => {
      const mockUser: UserRegisterCredentials = {
        email: "victor@andujar.org",
        password: "12345678",
        name: "victor",
        surname: "Jhon",
        username: "ammavaru",
      };

      const expectedError = new CustomError(
        "The user couldn't be created.",
        errorsManagerCodes.registerErrorStatusCode,
        errorsManagerMessages.registerPublicMessage
      );

      req.body = mockUser;
      UserModel.create = jest
        .fn()
        .mockRejectedValue(new Error("The user couldn't be created."));

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
