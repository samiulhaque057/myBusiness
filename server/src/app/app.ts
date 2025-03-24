import express, { Response, Request } from "express";
import cors from "cors";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { successResponse } from "../helper/responseHandler";
import { errorHandler } from "../middlewares/errorHandler";
import corsOptions from "../config/cors";
import routes from "./routes";

// app initialization
const app = express();

// cookie parser
app.use(cookieParser());

// json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors setup
app.use(cors(corsOptions));

// morgan
app.use(morgan("dev"));

// home route
app.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    successResponse(res, {
      statusCode: 200,
      message: "Api is running successfully.",
    });
  })
);

// routes
routes.forEach((router) => {
  app.use(router.path, router.route);
});

app.use(
  asyncHandler(async () => {
    throw createError.NotFound("Could not find this route.");
  })
);

// error handler
app.use(errorHandler);

export default app;
