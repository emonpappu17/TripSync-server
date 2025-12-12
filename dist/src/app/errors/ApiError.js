class ApiError extends Error {
    constructor(statusCode, message, errorMessages = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errorMessages = errorMessages;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default ApiError;
