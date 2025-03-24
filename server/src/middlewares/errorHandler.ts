import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { errorResponse } from "../helper/responseHandler";
import { Prisma } from "@prisma/client";
import handleClientError from "../errors/handleClientError";
import handleValidationError from "../errors/handleValidationError";
import handleZodError from "../errors/handleZodError";
import { ZodError } from "zod";
import { HttpError } from "http-errors";
import { ERRORS } from "../app/definition";

//error handle middlewares
export const errorHandler: ErrorRequestHandler = async (
  error: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    let errorMessage = error.message || "UnKnown Error";
    let errorStatus = error.status || 500;
    let errorMessages: ERRORS[] | null = [];

    if (error instanceof Prisma.PrismaClientValidationError) {
      const { statusCode, message, errors } = handleValidationError(error);
      errorMessage = message;
      errorStatus = statusCode;
      errorMessages = errors;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const { statusCode, message, errors } = handleClientError(error);
      errorMessage = message;
      errorStatus = statusCode;
      errorMessages = errors;
    } else if (error instanceof ZodError) {
      const { statusCode, message, errors } = handleZodError(error);
      errorMessage = message;
      errorStatus = statusCode;
      errorMessages = errors;
    }

    errorResponse(res, {
      statusCode: errorStatus,
      message: errorMessage,
      errors: errorMessages.length ? errorMessages : null,
    });
  } catch (error: any) {
    const errorMessage = (error as Error).message || "Internal server error";
    errorResponse(res, {
      statusCode: 500,
      message: errorMessage,
    });
  }
};
