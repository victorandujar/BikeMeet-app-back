import "../loadEnvironment.js";
import express from "express";
import cors from "cors";
import { ridesEndpoints, userEndpoints } from "../utils/endpoints/endpoints.js";
import usersRouter from "./routers/userRouter/userRouter.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";
import morgan from "morgan";
import ridesRouter from "./routers/ridesRouter/ridesRouter.js";

export const app = express();
app.disable("x-powered-by");

const corsOptions = {
  origin: [process.env.LOCALHOST!, process.env.VERCEL!],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use(userEndpoints.users, usersRouter);
app.use(ridesEndpoints.rides, ridesRouter);

app.use(notFoundError);
app.use(generalError);
