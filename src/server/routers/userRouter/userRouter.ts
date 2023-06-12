import { Router } from "express";
import endpoints from "../../../utils/endpoints/endpoints.js";
import {
  findUserEmail,
  findUserToRestorePassword,
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
  endpoints.register,
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);
usersRouter.post(
  endpoints.login,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);
usersRouter.post(endpoints.verifyEmail, verifyEmail);
usersRouter.post(endpoints.getUser, findUserEmail);
usersRouter.post(endpoints.recoveryPassword, recoveryPassword);
usersRouter.post(endpoints.resetPasswordEmail, findUserToRestorePassword);

export default usersRouter;
