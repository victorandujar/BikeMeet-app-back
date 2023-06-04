import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDataBase from "../../../database/connectDataBase";
import bcryptjs from "bcryptjs";
import { app } from "../../index.js";
import request from "supertest";
import { type UserCredentials } from "../../controllers/userControllers/types/types";
import { type UserRegisterCredentials } from "../../controllers/userControllers/types/types";
import { UserModel } from "../../../database/models/User";
import jwt from "jsonwebtoken";
import { usersPositiveStatusCodes } from "../../../utils/feedbackMessages/userPositiveFeedback/userPositiveFeedback";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongoServerUrl = mongodbServer.getUri();

  await connectDataBase(mongoServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await UserModel.deleteMany();
});

const mockUserDb: UserRegisterCredentials = {
  email: "jordi@gmail.com",
  password: "12345678",
  name: "jordi",
  surname: "pujol",
  confirmationCode: "asdjkdfjkldasjflk",
  isVerified: false,
  username: "Zoro",
};

describe("Given a POST '/users/login' endpoint", () => {
  const user: UserCredentials = {
    email: "jordi@gmail.com",
    password: "12345678",
  };
  const loginPath = "/users/login";

  describe("When it receives a request with an email 'jordi@gmail.com' and a password '12345678'", () => {
    test("Then it should respond with status 200 and an object in its body with the property 'token'", async () => {
      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "asdfasdfasdfgsadf3242345",
      }));
      const hashedPassword = await bcryptjs.hash(user.password, 10);

      await UserModel.create({
        ...mockUserDb,
        password: hashedPassword,
      });

      const response = await request(app)
        .post(loginPath)
        .send(user)
        .expect(usersPositiveStatusCodes.responseOk);

      expect(response.body).toHaveProperty("token");
    });
  });
});
