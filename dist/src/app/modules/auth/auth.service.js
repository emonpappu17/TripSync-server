/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role, } from "@prisma/client";
// import ApiError from "app/errors/ApiError";
// import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { prisma } from "src/app/lib/prisma";
import ApiError from "src/app/errors/ApiError";
import envVars from "src/app/config/env";
import { generateToken } from "src/app/utils/jwt/jwt";
// import envVars from "app/config/env";
// import { generateToken } from "app/utils/jwt/jwt";
class AuthService {
    async register(registerData) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: registerData.email },
        });
        if (existingUser) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(registerData.password, Number(envVars.JWT_SALT_ROUND));
        const newUser = await prisma.user.create({
            data: {
                email: registerData?.email,
                password: hashedPassword,
                role: Role.USER,
                fullName: registerData.fullName,
            },
        });
        return {
            newUser
        };
    }
    async login(credentials) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: credentials.email },
        });
        if (!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email');
        }
        // Check if user is active
        if (!user.isActive) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Your account has been deactivated. Please contact support.');
        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password');
        }
        // Generate tokens
        const accessToken = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        }, envVars.JWT_SECRET, envVars.JWT_EXPIRES_IN);
        const refreshToken = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        }, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES_IN);
        return {
            // user,
            accessToken,
            refreshToken
        };
    }
}
export default new AuthService();
