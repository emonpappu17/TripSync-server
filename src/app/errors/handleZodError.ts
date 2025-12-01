import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import ApiError from "./ApiError";

const handleZodError = (error: ZodError) => {
  const errorMessages = error.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1] as string,
    message: issue.message,
  }));

  return new ApiError(
    StatusCodes.BAD_REQUEST,
    "Validation Error",
    errorMessages
  );
};

export default handleZodError;
