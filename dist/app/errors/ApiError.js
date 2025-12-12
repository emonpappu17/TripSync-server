"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    statusCode;
    success;
    errorMessages;
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
exports.default = ApiError;
