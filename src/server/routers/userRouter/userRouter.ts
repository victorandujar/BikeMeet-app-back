import { Router } from "express";
import { userEndpoints } from "../../../utils/endpoints/endpoints.js";
import {
  findUserEmail,
  findUserToRestorePassword,
  getUser,
  loginUser,
  recoveryPassword,
  registerUser,
  verifyEmail,
} from "../../controllers/userControllers/userControllers.js";
import { validate } from "express-validation";
import loginUserSchema from "../../schemas/userSchemas/loginUserSchema.js";
import registerUserSchema from "../../schemas/userSchemas/registerUserSchema.js";

const usersRouter = Router();

usersRouter.post(
  userEndpoints.register,
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);
usersRouter.post(
  userEndpoints.login,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);
usersRouter.post(userEndpoints.verifyEmail, verifyEmail);
usersRouter.post(userEndpoints.userToVerify, findUserEmail);
usersRouter.post(userEndpoints.recoveryPassword, recoveryPassword);
usersRouter.post(userEndpoints.resetPasswordEmail, findUserToRestorePassword);
usersRouter.post(userEndpoints.getUser, getUser);

export default usersRouter;
