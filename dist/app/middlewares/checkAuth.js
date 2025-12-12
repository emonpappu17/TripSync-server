"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAuth = void 0;
const http_status_codes_1 = require("http-status-codes");
const env_1 = __importDefault(require("../config/env"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt/jwt");
const CheckAuth = (...authRoles) => async (req, res, next) => {
    try {
        const accessToken = req?.headers?.authorization || req?.cookies?.accessToken;
        if (!accessToken) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "No access token received");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.default.JWT_SECRET);
        const isUserExist = await prisma_1.prisma.user.findUniqueOrThrow({
            where: {
                email: verifiedToken.email,
            },
        });
        if (!isUserExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User does not exist");
        }
        if (!isUserExist.isActive) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `User is not active`);
        }
        if (isUserExist.isDeleted) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is deleted");
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not permitted to view this route !!!");
        }
        req.user = verifiedToken;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.CheckAuth = CheckAuth;
