/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import authService from "./auth.service";
import { STATUS_CODES } from "http";
import { convertToMilliseconds } from "app/utils/convertToMilliseconds ";
import envVars from "app/config/env";


class AuthController {
    register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await authService.register(req.body);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    });

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const accessTokenMaxAge = convertToMilliseconds(envVars.JWT_EXPIRES_IN);
        const refreshTokenMaxAge = convertToMilliseconds(envVars.JWT_REFRESH_EXPIRES_IN);

        const result = await authService.login(req.body);

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

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Login successful',
            data: result,
        });
    });

    // logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //     // In JWT, logout is handled on client side by removing token
    //     // If using refresh tokens, you would invalidate them here
    //     sendResponse(res, {
    //         statusCode: StatusCodes.OK,
    //         success: true,
    //         message: 'Logout successful',
    //         data: null,
    //     });
    // });
}

export default new AuthController();

