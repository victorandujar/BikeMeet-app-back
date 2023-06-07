import { Router } from "express";
import endpoints from "../../../utils/endpoints/endpoints.js";
import {
  findUserEmail,
  loginUser,
  recoveryPassword,
  registerUser,
  verifyEmail,
} from "../../controllers/userControllers/userControllers.js";

const usersRouter = Router();

usersRouter.post(endpoints.register, registerUser);
usersRouter.post(endpoints.login, loginUser);
usersRouter.post(endpoints.verifyEmail, verifyEmail);
usersRouter.post(endpoints.getUser, findUserEmail);
usersRouter.post(endpoints.recoveryPassword, recoveryPassword);

export default usersRouter;
