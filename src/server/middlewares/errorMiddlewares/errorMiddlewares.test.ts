import { type NextFunction, type Request, type Response } from "express";
import { generalError, notFoundError } from "./errorMiddlewares";
import { CustomError } from "../../../CustomError/CustomError";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const req: Partial<Request> = {};
const next = jest.fn() as NextFunction;

describe("Given a notFoundError middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should call its next method", () => {
      notFoundError(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError middleware", () => {
  describe("When it receives a request", () => {
    const statusCode = 404;
    const errorMessage = "There was an error";
    const publicErrorMessage = "Something went wrong";

    const error = new CustomError(errorMessage, statusCode, publicErrorMessage);
    test("Then it should call its status method with 404 code", () => {
      generalError(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call its json method with the message 'Something went wrong'", () => {
      generalError(error, req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ error: publicErrorMessage });
    });
  });

  describe("When the error is not a CustomError", () => {
    test("Then it should respond with the public message 'Something went wrong' and a status code 500", () => {
      const error = new Error();
      const publicMessage = "Something went wrong";

      generalError(error as CustomError, req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ error: publicMessage });
    });
  });
});
