"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("./ApiError"));
const handlePrismaError = (error) => {
    let message = "Database Error";
    let errorMessages = [];
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
            const cause = typeof error.meta?.cause === "string"
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
    return new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, message, errorMessages);
};
exports.default = handlePrismaError;
