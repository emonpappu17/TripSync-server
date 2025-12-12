/* eslint-disable @typescript-eslint/no-explicit-any */
// import catchAsync from "app/utils/catchAsync";
// import sendResponse from "app/utils/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import travelMatchService from "./travelMatch.service";
import catchAsync from "src/app/utils/catchAsync";
import pick from "src/app/helper/pick";
import sendResponse from "src/app/utils/sendResponse";
// import pick from "app/helper/pick";

class TravelMatchController {
  
    getMyMatches = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

        const result = await travelMatchService.getMyMatches(userId, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Your travel matches retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });

    getMatchesByPlanId = catchAsync(async (req: Request, res: Response) => {
        const { planId } = req.params;
        const userId = (req as any).user.id;

        const result = await travelMatchService.getMatchesByPlanId(planId, userId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Travel plan matches retrieved successfully',
            data: result,
        });
    });

  
    getMatchById = catchAsync(async (req: Request, res: Response) => {
        const { matchId } = req.params;
        const userId = (req as any).user.id;

        const result = await travelMatchService.getMatchById(matchId, userId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Match details retrieved successfully',
            data: result,
        });
    });

 
    deactivateMatch = catchAsync(async (req: Request, res: Response) => {
        const { matchId } = req.params;
        const userId = (req as any).user.id;

        const result = await travelMatchService.deactivateMatch(matchId, userId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: result.message,
            data: null,
        });
    });

 
    checkMatch = catchAsync(async (req: Request, res: Response) => {
        const { planId, otherUserId } = req.params;
        const userId = (req as any).user.id;

        const result = await travelMatchService.checkMatch(planId, userId, otherUserId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Match status retrieved',
            data: result,
        });
    });

 
    getMatchStatistics = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;

        const result = await travelMatchService.getMatchStatistics(userId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Match statistics retrieved successfully',
            data: result,
        });
    });
}

export default new TravelMatchController();