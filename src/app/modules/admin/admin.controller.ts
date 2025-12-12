/* eslint-disable @typescript-eslint/no-explicit-any */
// import catchAsync from "app/utils/catchAsync";
// import sendResponse from "app/utils/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import adminService from "./admin.service";
// import catchAsync from "src/app/utils/catchAsync";
// import sendResponse from "src/app/utils/sendResponse";
// import pick from "src/app/helper/pick";
// import pick from "app/helper/pick";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import pick from '../../helper/pick'

class AdminController {
    getDashboardStats = catchAsync(async (req: Request, res: Response) => {
        const result = await adminService.getDashboardStats();

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: result,
        });
    });

    getAnalytics = catchAsync(async (req: Request, res: Response) => {
        const filters = pick(req.query, ["startDate", "endDate", "type", "groupBy"])

        const result = await adminService.getAnalytics(filters);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Analytics data retrieved successfully',
            data: result,
        });
    });


    getAllUsers = catchAsync(async (req: Request, res: Response) => {
        const filters = pick(req.query, ["search", "role", "isActive", "isVerified"])
        const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

        const result = await adminService.getAllUsers(filters, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Users retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });

    manageUser = catchAsync(async (req: Request, res: Response) => {
        const adminId = (req as any).user.id;
        const result = await adminService.manageUser(adminId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'User action completed successfully',
            data: result,
        });
    });

    // moderateContent = catchAsync(async (req: Request, res: Response) => {
    //     const adminId = (req as any).user.id;
    //     const result = await adminService.moderateContent(adminId, req.body);

    //     sendResponse(res, {
    //         statusCode: statuscodes.OK,
    //         success: true,
    //         message: 'Content moderation completed successfully',
    //         data: result,
    //     });
    // });


    // getActivityLogs = catchAsync(async (req: Request, res: Response) => {
    //     const result = await adminService.getActivityLogs(req.query);

    //     sendResponse(res, {
    //         statusCode: statuscodes.OK,
    //         success: true,
    //         message: 'Activity logs retrieved successfully',
    //         data: result.data,
    //         meta: result.meta,
    //     });
    // });

    getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {
        const filters = pick(req.query, ["search", "status"])
        const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

        const result = await adminService.getAllTravelPlans(filters, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Travel plans retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });
}

export default new AdminController();