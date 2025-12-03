/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import travelPlanService from "./travelPlan.service";

class TravelPlanController {
    createTravelPlan = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const result = await travelPlanService.createTravelPlan(userId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Travel plan created successfully',
            data: result,
        });
    });

    // getTravelPlans = catchAsync(async (req: Request, res: Response) => {
    //     const result = await travelPlanService.getTravelPlans(req.query);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Travel plans retrieved successfully',
    //         data: result.data,
    //         meta: result.meta,
    //     });
    // });

    // getTravelPlanById = catchAsync(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const result = await travelPlanService.getTravelPlanById(id);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Travel plan retrieved successfully',
    //         data: result,
    //     });
    // });

    // updateTravelPlan = catchAsync(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const userId = (req as any).user.id;
    //     const result = await travelPlanService.updateTravelPlan(id, userId, req.body);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Travel plan updated successfully',
    //         data: result,
    //     });
    // });

    // deleteTravelPlan = catchAsync(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const userId = (req as any).user.id;
    //     await travelPlanService.deleteTravelPlan(id, userId);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Travel plan deleted successfully',
    //         data: null,
    //     });
    // });

    // getMyTravelPlans = catchAsync(async (req: Request, res: Response) => {
    //     const userId = (req as any).user.id;
    //     const result = await travelPlanService.getMyTravelPlans(userId, req.query);

    //     sendResponse(res, {
    //         statusCode: httpStatus.OK,
    //         success: true,
    //         message: 'Your travel plans retrieved successfully',
    //         data: result.data,
    //         meta: result.meta,
    //     });
    // });
}

export default new TravelPlanController();