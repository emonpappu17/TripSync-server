// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError";
import { Prisma } from "@prisma/client";
// import { Prisma } from "../../../prisma/generated/prisma/client";
// import { Prisma } from "prisma/generated/prisma/client";

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError) => {
  let message = "Database Error";
  let errorMessages: { path: string; message: string }[] = [];

  const target = Array.isArray(error.meta?.target)
    ? error.meta.target.join(", ")
    : typeof error.meta?.target === "string"
    ? error.meta.target
    : "";

  switch (error.code) {
    case "P2002": {
      // Unique constraint failed
      message = "Unique constraint failed";
      errorMessages = [
        {
          path: target,
          message: `${target} already exists`,
        },
      ];
      break;
    }

    case "P2025": {
      // Record not found
      const cause =
        typeof error.meta?.cause === "string"
          ? error.meta.cause
          : "Record not found";

      message = "Record not found";
      errorMessages = [
        {
          path: "",
          message: cause,
        },
      ];
      break;
    }

    default:
      message = error.message;
      errorMessages = [
        {
          path: "",
          message: error.message,
        },
      ];
  }

  return new ApiError(StatusCodes.BAD_REQUEST, message, errorMessages);
};

export default handlePrismaError;
