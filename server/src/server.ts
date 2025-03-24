import { Server } from "http";
import dotenv from "dotenv";
import { errorLogger, logger } from "./helper/logger";
import app from "./app/app";
import { hostname, port } from "./app/secret";

// server
let server = new Server(app);

// port setup
dotenv.config();

// app listen
app.listen(port, () => {
  logger.info(
    `server is running on http://localhost:${port} or http://${hostname}:${port}`
  );
});

// error handling for unhandledRejection
process.on("unhandledRejection", (error) => {
  if (server) {
    server.close(() => {
      // which error can't handle by global error handler
      errorLogger.error(error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// error handling for uncaughtException
process.on("uncaughtException", (error) => {
  errorLogger.error(error);
});
