"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("./ApiError"));
const handleZodError = (error) => {
    const errorMessages = error.issues.map((issue) => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));
    return new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Validation Error", errorMessages);
};
exports.default = handleZodError;
