/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import ApiError from "./ApiError";
import { IErrorResponse } from "./error.interface";

// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import envVars from "../config/env";
import handlePrismaError from "./handlePrismaErrors";
import handleZodError from "./handleZodError";
import { Prisma } from "@prisma/client";
// import { Prisma } from "../../../prisma/generated/prisma/client";
// import { Prisma } from "prisma/generated/prisma/client";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errorMessages: { path: string; message: string }[] = [];

  // 🔹 Zod validation error
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // 🔹 Prisma client known errors (P2002, P2025, etc.)
  else if (error instanceof Prisma.PrismaClientKnownRequestError
) {
    const simplifiedError = handlePrismaError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // 🔹 Our custom ApiError
  else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.errorMessages;
  }
  // 🔹 Native JS errors
  else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message ? [{ path: "", message: error.message }] : [];
  }

  // 🔹 Return ApiError formatted response
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: error.success,
      message: error.message,
      errorMessages: error.errorMessages,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });
  }

  // 🔹 Log unexpected error types
  console.error(error);

  const errorResponse: IErrorResponse = {
    success: false,
    message,
    errorMessages,
    stack: envVars.NODE_ENV === "development" ? error.stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
