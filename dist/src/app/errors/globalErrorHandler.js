"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const ApiError_1 = __importDefault(require("./ApiError"));
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
const env_1 = __importDefault(require("../config/env"));
const handlePrismaErrors_1 = __importDefault(require("./handlePrismaErrors"));
const handleZodError_1 = __importDefault(require("./handleZodError"));
const client_1 = require("@prisma/client");
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong!";
    let errorMessages = [];
    // 🔹 Zod validation error
    if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // 🔹 Prisma client known errors (P2002, P2025, etc.)
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, handlePrismaErrors_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // 🔹 Our custom ApiError
    else if (error instanceof ApiError_1.default) {
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
    if (error instanceof ApiError_1.default) {
        return res.status(error.statusCode).json({
            success: error.success,
            message: error.message,
            errorMessages: error.errorMessages,
            stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
        });
    }
    // 🔹 Log unexpected error types
    console.error(error);
    const errorResponse = {
        success: false,
        message,
        errorMessages,
        stack: env_1.default.NODE_ENV === "development" ? error.stack : undefined,
    };
    res.status(statusCode).json(errorResponse);
};
exports.default = globalErrorHandler;
