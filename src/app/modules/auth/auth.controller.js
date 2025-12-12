"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const catchAsync_1 = __importDefault(require("app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("app/utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = __importDefault(require("./auth.service"));
// import catchAsync from "src/app/utils/catchAsync";
// import sendResponse from "src/app/utils/sendResponse";
// import { convertToMilliseconds } from "src/app/utils/convertToMilliseconds ";
// import envVars from "src/app/config/env";
const convertToMilliseconds_1 = require("app/utils/convertToMilliseconds ");
const env_1 = __importDefault(require("app/config/env"));
class AuthController {
    register = (0, catchAsync_1.default)(async (req, res, next) => {
        const result = await auth_service_1.default.register(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    });
    login = (0, catchAsync_1.default)(async (req, res, next) => {
        const accessTokenMaxAge = (0, convertToMilliseconds_1.convertToMilliseconds)(env_1.default.JWT_EXPIRES_IN);
        const refreshTokenMaxAge = (0, convertToMilliseconds_1.convertToMilliseconds)(env_1.default.JWT_REFRESH_EXPIRES_IN);
        const result = await auth_service_1.default.login(req.body);
        const { refreshToken, accessToken } = result;
        res.cookie("accessToken", accessToken, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            maxAge: accessTokenMaxAge,
        });
        res.cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            maxAge: refreshTokenMaxAge,
        });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Login successful',
            data: result,
        });
    });
}
exports.default = new AuthController();
