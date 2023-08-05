import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../..";
import connectDataBase from "../../../database/connectDataBase";
import jwt from "jsonwebtoken";
import { Ride } from "../../../database/models/Ride";
import { type RideDataStructure } from "../../controllers/ridesControllers/types/types";
import { mockGravelRide } from "../../../mocks/ridesMocks/ridesMocks";
import { errorsManagerCodes } from "../../../utils/feedbackMessages/errorsFeedbackManager/errorsFeedbackManager";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongodbServerUrl = mongodbServer.getUri();

  await connectDataBase(mongodbServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await Ride.deleteMany();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a POST '/create' endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with status 201", async () => {
      const urlCreate = "/rides/create";

      const userId = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValue({ sub: userId });

      const response: { body: { ride: RideDataStructure } } = await request(app)
        .post(urlCreate)
        .set("content-type", "multipart/form-data")
        .field("title", mockGravelRide.title)
        .field("date", mockGravelRide.date.toString())
        .field("description", mockGravelRide.description)
        .field("distance", mockGravelRide.distance)
        .field("surfaceType", mockGravelRide.surfaceType)
        .attach("image", Buffer.from("uploads"), {
          filename: "3 nacions-3d60ef19-09fc-41ee-bf51-fa462a7e5ef9.jpg",
        })
        .expect(errorsManagerCodes.generalErrorStatusCode);
    });
  });
});
