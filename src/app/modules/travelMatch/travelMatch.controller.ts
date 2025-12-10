/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "app/utils/catchAsync";
import sendResponse from "app/utils/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import travelMatchService from "./travelMatch.service";
import pick from "app/helper/pick";

class TravelMatchController {
    /**
     * Get all matches for the authenticated user
     * GET /api/v1/travel-matches/my-matches
     */
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

    /**
     * Get all matches for a specific travel plan
     * GET /api/v1/travel-matches/plan/:planId
     */
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

    /**
     * Get a specific match by ID
     * GET /api/v1/travel-matches/:matchId
     */
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

    /**
     * Deactivate a match
     * DELETE /api/v1/travel-matches/:matchId
     */
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

    /**
     * Check if matched with another user for a specific plan
     * GET /api/v1/travel-matches/check/:planId/:otherUserId
     */
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

    /**
     * Get match statistics for the authenticated user
     * GET /api/v1/travel-matches/statistics
     */
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