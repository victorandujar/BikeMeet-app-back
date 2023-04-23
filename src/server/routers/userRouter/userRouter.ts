import { Router } from "express";
import endpoints from "../../../utils/endpoints/endpoints.js";
import { registerUser } from "../../controllers/userControllers/userControllers.js";

const usersRouter = Router();

usersRouter.post(endpoints.register, registerUser);

export default usersRouter;
