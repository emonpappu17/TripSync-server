/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userService from "./user.service";
import { fileUploader } from "app/helper/fileUploader";
import pick from "app/helper/pick";

class UserController {
    updateUser = catchAsync(async (req: Request, res: Response) => {
        // req.body = JSON.parse(req.body.data);

        const file = req.file;
        // console.log({ file });

        if (file) {
            const updatedImage = await fileUploader.uploadToCloudinary(file);
            req.body.profileImage = updatedImage?.secure_url;
        }

        // console.log('req.body==>', req.body);

        const userId = (req as any).user.id;

        const result = await userService.updateProfile(userId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'User updated successfully',
            data: result,
        });
    });

    getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const filters = pick(req.query, ["search", "role", "isActive",])
        const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

        const result = await userService.getAllUsers(filters, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Users retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });

    getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await userService.getUserById(id);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'User retrieved successfully',
            data: result,
        });
    });

    getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user.id;
        const result = await userService.getUserById(userId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Profile retrieved successfully',
            data: result,
        });
    });

    deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await userService.deleteUser(id);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'User deleted successfully',
            data: null,
        });
    });

}

export default new UserController();