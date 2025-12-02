/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userService from "./user.service";

class UserController {
    updateUser = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const result = await userService.updateProfile(userId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'User updated successfully',
            data: result,
        });
    });

}

export default new UserController();