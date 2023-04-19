import "./loadEnvironment.js";
import createDebug from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";
import connectDataBase from "./database/connectDataBase.js";

const debug = createDebug("bikemeet:*");

const port = process.env.PORT ?? 4000;

try {
  await connectDataBase(process.env.MONGODB_DATABASE_CONNECTION!);
  debug(chalk.green(`Connected to database`));

  await startServer(+port);
  debug(chalk.green(`Server listening on port ${port}`));
} catch (error) {
  debug(error.message);
}
