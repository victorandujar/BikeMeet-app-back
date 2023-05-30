import { Router } from "express";
import endpoints from "../../../utils/endpoints/endpoints.js";
import {
  loginUser,
  registerUser,
  verifyEmail,
} from "../../controllers/userControllers/userControllers.js";

const usersRouter = Router();

usersRouter.post(endpoints.register, registerUser);
usersRouter.post(endpoints.login, loginUser);
usersRouter.post(endpoints.verifyEmail, verifyEmail);

export default usersRouter;
