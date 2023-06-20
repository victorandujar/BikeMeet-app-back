/* eslint-disable max-nested-callbacks */
import { type NextFunction, type Request, type Response } from "express";
import { mockRides } from "../../../mocks/ridesMocks/ridesMocks";
import { Ride } from "../../../database/models/Ride";
import { getAllRides } from "./ridesControllers";
import { positiveFeedbackStatusCodes } from "../../../utils/feedbackMessages/positiveFeedbackManager/positiveFeedbackManager";
import { CustomError } from "../../../CustomError/CustomError";
import {
  errorsManagerCodes,
  ridesErrorsManagerStructure,
  userErrorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsFeedbackManager/errorsFeedbackManager";

describe("Given a getAllRides controller", () => {
  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockResolvedValue(mockRides),
  };
  const next = jest.fn();
  describe("When it receives a request to get all rides", () => {
    test("Then it should respond with status 200 and a json with all rides", async () => {
      Ride.find = jest.fn().mockImplementationOnce(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockReturnValue(mockRides),
        })),
      }));

      await getAllRides(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(
        positiveFeedbackStatusCodes.responseOk
      );
      expect(res.json).toHaveBeenCalledWith({ rides: mockRides });
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call its next function", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };
      const req: Partial<Request> = {};
      const next = jest.fn();

      const expectedError = new CustomError(
        ridesErrorsManagerStructure.notFoundRides,
        errorsManagerCodes.notFound,
        ridesErrorsManagerStructure.notFoundRides
      );

      req.body = {};

      Ride.find = jest.fn().mockImplementationOnce(() => ({
        populate: jest.fn().mockImplementationOnce(() => ({
          exec: jest
            .fn()
            .mockRejectedValue(
              new Error(ridesErrorsManagerStructure.notFoundRides)
            ),
        })),
      }));

      await getAllRides(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
