/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import travelPlanService from "./travelPlan.service";
import catchAsync from "../../utils/catchAsync";
import { fileUploader } from "../../helper/fileUploader";
import sendResponse from "../../utils/sendResponse";
import pick from "../../helper/pick";
// import catchAsync from "src/app/utils/catchAsync";
// import { fileUploader } from "src/app/helper/fileUploader";
// import sendResponse from "src/app/utils/sendResponse";
// import pick from "src/app/helper/pick";
// import { fileUploader } from "app/helper/fileUploader";

class TravelPlanController {
    createTravelPlan = catchAsync(async (req: Request, res: Response) => {
        // if (req?.file) {
        //     req.body.image = req?.file?.path; // directly assign the URL
        // }

        if (req?.file) {
            // req.body.profileImage =  req?.file?.path;;
            const updatedImage = await fileUploader.uploadToCloudinary(req?.file);

            req.body.image = updatedImage?.secure_url;
        }

        const userId = (req as any).user.id;
        const result = await travelPlanService.createTravelPlan(userId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Travel plan created successfully',
            data: result,
        });
    });

    getTravelPlans = catchAsync(async (req: Request, res: Response) => {
        const filters = pick(req.query, ["search", "destination", "country", "startDate", "endDate", "budgetMin", "budgetMax", "travelType", "status", "userId"])
        const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

        const result = await travelPlanService.getTravelPlans(filters, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Travel plans retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });

    getTravelPlanById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await travelPlanService.getTravelPlanById(id as string);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Travel plan retrieved successfully',
            data: result,
        });
    });
    getTravelPlanByUserId = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await travelPlanService.getTravelPlanByUserId(id as string);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Travel plan retrieved successfully',
            data: result,
        });
    });

    getMyTravelPlans = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const result = await travelPlanService.getMyTravelPlans(userId, req.query);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Your travel plans retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });

    updateTravelPlan = catchAsync(async (req: Request, res: Response) => {
        // if (req?.file) {
        //     req.body.image = req?.file?.path; // directly assign the URL
        // }

        if (req?.file) {
            // req.body.profileImage =  req?.file?.path;;
            const updatedImage = await fileUploader.uploadToCloudinary(req?.file);
            req.body.image = updatedImage?.secure_url;
        }

        const { id } = req.params;
        const userId = (req as any).user.id;
        const result = await travelPlanService.updateTravelPlan(id as string, userId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Travel plan updated successfully',
            data: result,
        });
    });

    deleteTravelPlan = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = (req as any).user.id;
        await travelPlanService.deleteTravelPlan(id as string, userId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Travel plan deleted successfully',
            data: null,
        });
    });
}

export default new TravelPlanController();