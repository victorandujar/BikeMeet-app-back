import express from "express";
import cors from "cors";

export const app = express();
app.disable("x-powered-by");

const corsOptions = {
  origin: ["http://localhost:4000/"],
};

app.use(express.json());
app.use(cors(corsOptions));
