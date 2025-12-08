/* eslint-disable @typescript-eslint/no-explicit-any */
import pick from "app/helper/pick";
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import travelPlanService from "./travelPlan.service";
// import { fileUploader } from "app/helper/fileUploader";

class TravelPlanController {
    createTravelPlan = catchAsync(async (req: Request, res: Response) => {
        // const file = req.file;
        // // console.log({ file });

        // if (file) {
        //     // const updatedImage = await fileUploader.uploadToCloudinary(file);
        //     req.body.image = file?.path;
        //     // req.body.image = updatedImage?.secure_url;
        // }

        // console.log('req.file.path===>', req?.file?.buffer);

        if (req?.file) {
            req.body.image = req?.file?.path; // directly assign the URL
        }

        // const file = req.file as Express.Multer.File | undefined;

        // if (file && file.buffer) {
        //     const uploaded = await streamUpload(file.buffer);
        //     req.body.image = uploaded.secure_url;
        // }

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
        const result = await travelPlanService.getTravelPlanById(id);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Travel plan retrieved successfully',
            data: result,
        });
    });
    getTravelPlanByUserId = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await travelPlanService.getTravelPlanByUserId(id);

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
        if (req?.file) {
            req.body.image = req?.file?.path; // directly assign the URL
        }
        const { id } = req.params;
        const userId = (req as any).user.id;
        const result = await travelPlanService.updateTravelPlan(id, userId, req.body);

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
        await travelPlanService.deleteTravelPlan(id, userId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Travel plan deleted successfully',
            data: null,
        });
    });
}

export default new TravelPlanController();