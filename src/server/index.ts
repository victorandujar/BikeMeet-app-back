import "../loadEnvironment.js";
import express from "express";
import cors from "cors";
import endpoints from "../utils/endpoints/endpoints.js";
import usersRouter from "./routers/userRouter/userRouter.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";
import morgan from "morgan";

export const app = express();
app.disable("x-powered-by");

const corsOptions = {
  origin: [process.env.LOCALHOST!],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use(endpoints.users, usersRouter);

app.use(notFoundError);
app.use(generalError);
