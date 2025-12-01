/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import authService from "./auth.service";


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
}

export default new AuthController();

