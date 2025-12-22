/* eslint-disable @typescript-eslint/no-explicit-any */
;
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import travelMatchService from "./travelMatch.service";
import catchAsync from "../../utils/catchAsync";
import pick from "../../helper/pick";
import sendResponse from "../../utils/sendResponse";

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

        const result = await travelMatchService.getMatchesByPlanId(planId as  string, userId);

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

        const result = await travelMatchService.getMatchById(matchId as string, userId);

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

        const result = await travelMatchService.deactivateMatch(matchId as string, userId);

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

        const result = await travelMatchService.checkMatch(planId as string, userId, otherUserId as string);

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