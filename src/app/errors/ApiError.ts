import { IApiError } from "./error.interface";

class ApiError extends Error implements IApiError {
  public statusCode: number;
  public success: boolean;
  public errorMessages: { path: string; message: string }[];

  constructor(
    statusCode: number,
    message: string,
    errorMessages: { path: string; message: string }[] = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errorMessages = errorMessages;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
