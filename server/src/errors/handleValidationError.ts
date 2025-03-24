import { Prisma } from "@prisma/client";

const handleValidationError = (error: Prisma.PrismaClientValidationError) => {
  //   const missingArg = (error.message as string)
  //     .split("Argument")[1]
  //     .trim()
  //     .split("`")[1];
  console.log(error);

  const errors = [
    {
      path: "",
      message: error.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errors,
  };
};

export default handleValidationError;
