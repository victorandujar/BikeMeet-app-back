import "./loadEnvironment.js";
import createDebug from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";

const debug = createDebug("index:*");

const port = process.env.PORT ?? 4000;

try {
  await startServer(+port);
  debug(chalk.green(`Server listening on port ${port}`));
} catch (error) {
  debug(error.message);
}
