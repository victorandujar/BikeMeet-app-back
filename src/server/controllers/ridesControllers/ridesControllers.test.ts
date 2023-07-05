/* eslint-disable max-nested-callbacks */
import { type Request, type Response } from "express";
import {
  mockGravelRide,
  mockRides,
} from "../../../mocks/ridesMocks/ridesMocks";
import { Ride } from "../../../database/models/Ride";
import { createRide, getAllRides, getRideById } from "./ridesControllers";
import { positiveFeedbackStatusCodes } from "../../../utils/feedbackMessages/positiveFeedbackManager/positiveFeedbackManager";
import { CustomError } from "../../../CustomError/CustomError";
import {
  errorsManagerCodes,
  ridesErrorsManagerStructure,
  userErrorsManagerMessages,
} from "../../../utils/feedbackMessages/errorsFeedbackManager/errorsFeedbackManager";
import { type CustomRideRequest } from "./types/types";

beforeEach(() => jest.clearAllMocks());

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

describe("Given the getRideById controller", () => {
  const req: Partial<Request> = {
    params: { rideId: mockGravelRide.rideId! },
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  describe("When it receives a request with id '6488426a98040d0f5e10201b'", () => {
    test("Then it should respond with status 200 and 'Ruta de Montaña A' ride in it", async () => {
      Ride.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockGravelRide),
      }));

      await getRideById(req as CustomRideRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(
        positiveFeedbackStatusCodes.responseOk
      );
      expect(res.json).toHaveBeenCalledWith({ ride: mockGravelRide });
    });
  });

  describe("When it receives a response without ride", () => {
    test("Then is should call next function with 'Something went wrong!. Try again' message", async () => {
      const customError = new CustomError(
        ridesErrorsManagerStructure.notFoundRide,
        errorsManagerCodes.notFound,
        userErrorsManagerMessages.publicMessageDefault
      );

      Ride.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest
          .fn()
          .mockRejectedValue(
            new Error(ridesErrorsManagerStructure.notFoundRide)
          ),
      }));

      await getRideById(req as CustomRideRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given the createRide controller", () => {
  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue({}),
  };
  const next = jest.fn();

  describe("When it receives a request with the data of a new ride", () => {
    test("Then it should respond with status 201 and its json method with the created ride", async () => {
      const expectedStatusCode = positiveFeedbackStatusCodes.created;

      Ride.create = jest.fn().mockReturnValue({
        ...mockGravelRide,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        toJSON: jest.fn().mockReturnValue(mockGravelRide),
      });
      await createRide(req as CustomRideRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(mockGravelRide);
    });
  });
});
