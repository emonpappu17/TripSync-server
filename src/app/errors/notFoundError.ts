import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError";

class NotFoundError extends ApiError {
  constructor(path: string) {
    super(StatusCodes.NOT_FOUND, `Route Not Found: ${path}`);
  }
}

export default NotFoundError;
