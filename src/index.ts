import "./loadEnvironment.js";
import express from "express";
import createDebug from "debug";

const debug = createDebug("index:*");

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.json({ ping: "Pong" });
});

app.listen(port, () => {
  debug(`Server listening on port ${port}`);
});
