import { ZodError, ZodIssue } from "zod";
import { ERRORS } from "../app/definition";

const handleZodError = (error: ZodError) => {
  const errors: ERRORS[] = error?.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  // if in production
  if (process.env.NODE_ENV === "development") {
    return {
      statusCode,
      message: errors[0]?.message,
      errors,
    };
  }

  return {
    statusCode,
    message: "Validation Error",
    errors,
  };
};

export default handleZodError;
