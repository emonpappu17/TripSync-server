/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role, User, } from "@prisma/client";
import ApiError from "app/errors/ApiError";
import { prisma } from "app/lib/prisma";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs"
import envVars from "app/config/env";

class AuthService {
    async register(registerData: Partial<User>): Promise<any> {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: registerData.email },
        });

        if (existingUser) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerData.password as string, Number(envVars.JWT_SALT_ROUND));

        const newUser = await prisma.user.create({
            data: {
                email: registerData?.email as string,
                password: hashedPassword,
                role: Role.USER,
                fullName: registerData.fullName as string,
            },
        });

        return {
            newUser
        };
    }


}

export default new AuthService();