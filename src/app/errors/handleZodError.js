import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError";
const handleZodError = (error) => {
    const errorMessages = error.issues.map((issue) => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));
    return new ApiError(StatusCodes.BAD_REQUEST, "Validation Error", errorMessages);
};
export default handleZodError;
