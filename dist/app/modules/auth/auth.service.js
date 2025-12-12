"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const env_1 = __importDefault(require("../../config/env"));
const jwt_1 = require("../../utils/jwt/jwt");
class AuthService {
    async register(registerData) {
        // Check if user already exists
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: registerData.email },
        });
        if (existingUser) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already exists');
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(registerData.password, Number(env_1.default.JWT_SALT_ROUND));
        const newUser = await prisma_1.prisma.user.create({
            data: {
                email: registerData?.email,
                password: hashedPassword,
                role: client_1.Role.USER,
                fullName: registerData.fullName,
            },
        });
        return {
            newUser
        };
    }
    async login(credentials) {
        // Find user
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: credentials.email },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid email');
        }
        // Check if user is active
        if (!user.isActive) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Your account has been deactivated. Please contact support.');
        }
        // Compare password
        const isPasswordValid = await bcryptjs_1.default.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid password');
        }
        // Generate tokens
        const accessToken = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        }, env_1.default.JWT_SECRET, env_1.default.JWT_EXPIRES_IN);
        const refreshToken = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        }, env_1.default.JWT_REFRESH_SECRET, env_1.default.JWT_REFRESH_EXPIRES_IN);
        return {
            // user,
            accessToken,
            refreshToken
        };
    }
}
exports.default = new AuthService();
