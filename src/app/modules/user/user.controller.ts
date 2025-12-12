/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userService from "./user.service";
import catchAsync from "../../utils/catchAsync";
import { fileUploader } from "../../helper/fileUploader";
import sendResponse from "../../utils/sendResponse";
import pick from "../../helper/pick";

// import { fileUploader } from "app/helper/fileUploader";

class UserController {
    updateMyProfile = catchAsync(async (req: Request, res: Response) => {
        // req.body = JSON.parse(req.body.data);

        const file = req.file;
        // console.log({ file });

        if (file) {
            // req.body.profileImage =  req?.file?.path;;
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

    getUserStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        // const id = req.params.id || (req as any).user.id;

        const result = await userService.getUserStats(id as string);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'User statistics retrieved successfully',
            data: result,
        });
    });

    getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await userService.getUserById(id as string) ;

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

    changeUserStatus = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await userService.changeUserStatus(id as string, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Status updated successfully',
            data: result,
        });
    });

    deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await userService.deleteUser(id as string);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'User deleted successfully',
            data: null,
        });
    });

}

export default new UserController();