/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import travelRequestService from "./travelRequest.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
// import catchAsync from "src/app/utils/catchAsync";
// import sendResponse from "src/app/utils/sendResponse";

class TravelRequestController {
    createRequest = catchAsync(async (req: Request, res: Response) => {
        const requesterId = (req as any).user.id;

        // console.log('created//');
        const result = await travelRequestService.createRequest(requesterId, req.body);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Travel request sent successfully',
            data: result,
        });
    });

    getSentRequests = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const result = await travelRequestService.getMyRequests(userId, 'sent', req.query);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Sent requests retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });

    getReceivedRequests = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const result = await travelRequestService.getMyRequests(userId, 'received', req.query);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Received requests retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    });

    updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const receiverId = (req as any).user.id;
        const { status } = req.body;
        const result = await travelRequestService.updateRequestStatus(id as string, receiverId, status);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Request status updated successfully',
            data: result,
        });
    });

    cancelRequest = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const requesterId = (req as any).user.id;
        await travelRequestService.cancelRequest(id as string, requesterId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Request cancelled successfully',
            data: null,
        });
    });
}

export default new TravelRequestController();